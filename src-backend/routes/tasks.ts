import { Request, Response, Router } from 'express'
import { getRepository } from 'typeorm'
import { Task } from '../../src-common/entity/Task'

const router = Router()

router.get('/tasks', async (request: Request, response: Response) => {
  const tasksRepository = getRepository(Task)
  const tasks = await tasksRepository.find()
  response.send({ tasks })
})

router.post('/tasks', async (request: Request, response: Response) => {
  const tasksRepository = getRepository(Task)
  const entity = tasksRepository.create(request.body)
  await tasksRepository.insert(entity)
  response.send(entity)
})

router.patch('/tasks/:id', async (request: Request, response: Response) => {
  const id = Number(request.params.id)
  const tasksRepository = getRepository(Task)
  const entity = await tasksRepository.save({ ...request.body, id })
  response.send(entity)
})

export default router
