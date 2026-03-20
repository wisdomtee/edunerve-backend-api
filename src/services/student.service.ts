await checkStudentQuota(req.user.schoolId);

const student = await prisma.student.create({
  data: {
    name: req.body.name,
    schoolId: req.user.schoolId
  }
});

return student;