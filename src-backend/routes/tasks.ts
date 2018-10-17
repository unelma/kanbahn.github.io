import { Request, Response, Router } from 'express'
import { getManager, getRepository, MoreThan } from 'typeorm'
import { Task } from '../../src-common/entity/Task'

const router = Router()

router.get('/api/tasks', async (request: Request, response: Response) => {
  const tasksRepository = getRepository(Task)
  const tasks = await tasksRepository.find({ order: { stage: 'ASC', index: 'ASC' } })
  response.send({ tasks })
})

router.post('/api/tasks', async (request: Request, response: Response) => {
  const entity = await getManager().transaction(async entityManager => {
    const tasksRepository = entityManager.getRepository(Task)
    const index = await tasksRepository.count({ where: { stage: request.body.stage } })
    const entity = tasksRepository.create({ ...request.body, index })
    await tasksRepository.insert(entity)
    return entity
  })
  response.send(entity)
})

router.patch('/api/tasks/:id', async (request: Request, response: Response) => {
  const id = Number(request.params.id)
  const body: Partial<Task> = request.body

  const entity = await getManager().transaction(async entityManager => {
    const tasksRepository = entityManager.getRepository(Task)

    if (body.title !== undefined) {
      await tasksRepository.save({ id, title: body.title })
    }

    if (body.stage !== undefined) {
      const entity = await tasksRepository.findOneOrFail({ id })
      await tasksRepository.decrement({ index: MoreThan(entity.index), stage: entity.stage }, 'index', 1)
      const index = await tasksRepository.count({ where: { stage: body.stage } })
      await tasksRepository.save({ id, index, stage: body.stage })
    }

    return await tasksRepository.findOneOrFail({ id })
  })

  response.send(entity)
})

router.delete('/api/tasks/:id', async (request: Request, response: Response) => {
  const id = Number(request.params.id)

  await getManager().transaction(async entityManager => {
    const tasksRepository = entityManager.getRepository(Task)
    const entity = await tasksRepository.findOneOrFail({ id })
    await tasksRepository.delete({ id })
    await tasksRepository.decrement({ index: MoreThan(entity.index), stage: entity.stage }, 'index', 1)
  })

  response.send({})
})

export default router
