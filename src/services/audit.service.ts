import prisma from "../prisma";

export const logAuditEvent = async (data: any) => {
  await prisma.auditLog.create({
    data: {
      schoolId: data.schoolId,
      userId: data.userId,
      action: data.action,
      entity: data.entity,
      metadata: data.metadata || {}
    }
  });
};