const {
  Notification,
  User,
  Post,
  Loan,
  sequelize,
  Sequelize,
} = require('../../models');

async function listNotifications(req, res, next) {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      include: [
        { model: User, as: 'actor', attributes: ['id', 'name', 'avatar'] },
        { model: Post, as: 'post', attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 30,
    });
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
}

async function markAllRead(req, res, next) {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } },
    );
    res.json({ success: true, data: { isRead: true } });
  } catch (error) {
    next(error);
  }
}

async function respondToLoanRequest(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { decision } = req.body;
    if (!['accept', 'reject'].includes(decision)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'La decisión debe ser accept o reject.',
      });
    }

    const notification = await Notification.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
        type: 'loan_request',
      },
      transaction,
      lock: true,
    });
    if (!notification) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada.',
      });
    }

    const loan = await Loan.findByPk(notification.loanId, {
      transaction,
      lock: true,
    });
    const post = await Post.findByPk(notification.postId, {
      transaction,
      lock: true,
    });
    if (!loan || !post) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'La publicación o la solicitud ya no existe.',
      });
    }
    if (post.authorId !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para responder esta solicitud.',
      });
    }
    if (loan.status !== 'pending') {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: 'Esta solicitud ya fue respondida.',
      });
    }

    if (decision === 'accept') {
      if (post.status === 'lent') {
        await transaction.rollback();
        return res.status(409).json({
          success: false,
          message: 'El artículo ya fue asignado a otra solicitud.',
        });
      }
      await loan.update(
        { status: 'approved', approvalDate: new Date() },
        { transaction },
      );
      await post.update({ status: 'lent' }, { transaction });
      const otherPendingLoans = await Loan.findAll({
        where: {
          postId: post.id,
          status: 'pending',
        },
        attributes: ['id', 'lenderId', 'borrowerId'],
        transaction,
      });
      await Loan.update(
        { status: 'rejected' },
        {
          where: {
            postId: post.id,
            status: 'pending',
          },
          transaction,
        },
      );
      const otherLoanIds = otherPendingLoans.map((item) => item.id);
      if (otherLoanIds.length > 0) {
        await Notification.update(
          { type: 'loan_rejected', isRead: true },
          {
            where: { loanId: { [Sequelize.Op.in]: otherLoanIds } },
            transaction,
          },
        );
        await Notification.bulkCreate(
          otherPendingLoans.map((pendingLoan) => ({
            type: 'request_rejected',
            message: `La publicación “${post.title}” fue asignada a otra solicitud.`,
            userId:
              pendingLoan.lenderId === post.authorId
                ? pendingLoan.borrowerId
                : pendingLoan.lenderId,
            actorId: req.user.id,
            postId: post.id,
            loanId: pendingLoan.id,
          })),
          { transaction },
        );
      }
    } else {
      await loan.update({ status: 'rejected' }, { transaction });
    }

    await notification.update({
      isRead: true,
      type: decision === 'accept' ? 'loan_accepted' : 'loan_rejected',
    }, { transaction });

    await Notification.create({
      type: decision === 'accept' ? 'request_accepted' : 'request_rejected',
      message:
        decision === 'accept'
          ? `${req.user.name} aceptó tu solicitud para “${post.title}”.`
          : `${req.user.name} rechazó tu solicitud para “${post.title}”.`,
      userId: notification.actorId,
      actorId: req.user.id,
      postId: post.id,
      loanId: loan.id,
    }, { transaction });

    await transaction.commit();
    res.json({
      success: true,
      data: {
        decision,
        loanStatus: decision === 'accept' ? 'approved' : 'rejected',
        postStatus: post.status,
      },
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

module.exports = { listNotifications, markAllRead, respondToLoanRequest };
