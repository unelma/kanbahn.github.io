import React from 'react'
import TaskColumn, { columnMargin } from './TaskColumn'
import { addList, deleteLane } from '../store/listReducer'
import { taskCreation, moveTask, deleteTask } from '../store/taskReducer'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Task } from '../../src-common/entity/Task'
import { List } from '../../src-common/entity/List'
import { GradientContainer, Title, transparentButtonStyles } from './common'
import { Plus, X } from 'react-feather'
import { StoreState } from '../store/store'

interface FeatureLaneOwnProps {
  featureName: string
}

interface FeatureLaneDispatchProps {
  addList: typeof addList
  taskCreation: typeof taskCreation
  moveTask: typeof moveTask
  deleteLane: typeof deleteLane
}

interface FeatureLaneStoreProps {
  lists: List[]
  tasks: Task[]
}

type FeatureLaneProps = FeatureLaneOwnProps & FeatureLaneDispatchProps & FeatureLaneStoreProps

const FeatureLane = (props: FeatureLaneProps) => {
  const addList = () => props.addList(props.featureName)
  const deleteThisLane = () => props.deleteLane(props.featureName)
  const { featureName, tasks, lists } = props

  const lanesTasks = tasks.filter(task => task.list.lane === featureName)
  const lanesColumns = lists.filter(list => list.lane === featureName)

  return (
    <GradientContainer>
      <FlexContainerHeader>
        <Title>{featureName}</Title>
        <DeleteLaneButton onClick={deleteThisLane}>
          <X/>
        </DeleteLaneButton>
      </FlexContainerHeader>
      <FlexContainer>
        {lanesColumns.map(list => (
          <TaskColumn
            key={list.id}
            list={list}
            columnSpan={1}
            laneName={featureName}
            tasks={lanesTasks.filter(task => task.list.id === list.id)}
            moveTask={props.moveTask}
          />
        ))}

        <AddColumnButton onClick={addList}>
          <Plus/>
        </AddColumnButton>
      </FlexContainer>
    </GradientContainer>
  )
}

const FlexContainer = styled.div`
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
`

const FlexContainerHeader = styled.div`
  justify-content: space-between;
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
`

const AddColumnButton = styled.button`
  ${transparentButtonStyles}
  ${columnMargin};
`

const DeleteLaneButton = styled.button`
  ${transparentButtonStyles}
  margin-right: 6px;
  float: right;
`

const mapStateToProps = (state: StoreState) => {
  return {
    lists: state.lists,
    tasks: state.tasks
  }
}

const mapDispatchToProps = {
  taskCreation,
  moveTask,
  deleteTask,
  addList,
  deleteLane
}

const ConnectedFeatureLane = connect(mapStateToProps, mapDispatchToProps)(FeatureLane)

export default DragDropContext<FeatureLaneOwnProps>(HTML5Backend)(ConnectedFeatureLane)
