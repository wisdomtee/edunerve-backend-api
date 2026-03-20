router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { name, subject, schoolId } = req.body

  const teacher = await prisma.teacher.update({
    where: { id },
    data: {
      name,
      subject,
      schoolId,
    },
  })

  res.json(teacher)
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  await prisma.teacher.delete({
    where: { id },
  })

  res.json({ message: "Teacher deleted" })
})