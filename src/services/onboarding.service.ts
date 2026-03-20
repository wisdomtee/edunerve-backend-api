import prisma from "../prisma";
import bcrypt from "bcrypt";

/**
 * School Onboarding Pipeline
 */
export const onboardSchool = async (data: any) => {
  const { schoolName, adminName, email, password } = data;

  // 1. Create School Tenant
  const school = await prisma.school.create({
    data: {
      name: schoolName
    }
  });

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.create({
    data: {
      name: adminName,
      email,
      password: hashedPassword,
      role: "ADMIN",
      schoolId: school.id
    }
  });

  // 3. Assign Default Subscription Plan
  const defaultPlan = await prisma.subscriptionPlan.findFirst({
    where: {
      name: "Basic"
    }
  });

  if (defaultPlan) {
    await prisma.schoolSubscription.create({
      data: {
        schoolId: school.id,
        planId: defaultPlan.id,
        status: "ACTIVE",
        startDate: new Date()
      }
    });
  }

  return {
    school,
    adminUser
  };
};