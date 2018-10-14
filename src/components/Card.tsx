import * as React from 'react'
import { ConnectDragSource, DragSource, DragSourceSpec, DragSourceCollector } from 'react-dnd'
import TextAreaAutoSize from 'react-textarea-autosize'
import styled from 'styled-components'
import { cardPadding, defaultMargin } from './common'
import MenuButton, { MenuIcon } from './MenuButton'

const cardSource: DragSourceSpec<CardProps> = {
  beginDrag(props) {
    return { taskId: props.taskId }
  }
}

const collect: DragSourceCollector = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

interface CardProps {
  taskId: number
  content: string
  columnSpan: number
  handleChange: React.ChangeEventHandler<HTMLTextAreaElement>
}

interface CardDragSourceProps {
  isDragging: boolean
  connectDragSource: ConnectDragSource
}

class Card extends React.Component<CardProps & CardDragSourceProps> {
  render() {
    const { content, columnSpan, handleChange, connectDragSource } = this.props

    return (
      <Container columnSpan={columnSpan} innerRef={connectDragSource}>
        <TextArea
          value={content}
          onChange={handleChange}
          autoFocus={true}
          wrap='soft'
          minRows={2}
        />
        <MenuButton/>
      </Container>
    )
  }
}

interface ContainerProps {
  columnSpan: number
}

export const Container = styled.div<ContainerProps>`
  margin: ${defaultMargin};
  padding: ${cardPadding};
  width: calc(${props => 100 / props.columnSpan}% - calc(2 * ${defaultMargin}));
  min-width: 175px;
  box-sizing: border-box;
  overflow: hidden;
  overflow-wrap: break-word;
  background: linear-gradient(to top left, rgb(255, 246, 196), rgb(252, 247, 221));
  border: 0 solid rgb(211, 204, 163);
  box-shadow: 2px 2px 6px rgba(0, 0, 0, .5);
  border-radius: 2px;
  display: flex;

  &:not(:hover) ${MenuIcon} {
    opacity: 0;
  }
`

const TextArea = styled(TextAreaAutoSize)`
  background: rgba(255, 255, 255, 0);
  border-width: 0;
  font: inherit;
  color: inherit;
  width: 100%;
  padding: 0;
  resize: none;
  outline: none;
`

export default DragSource<CardProps>('Card', cardSource, collect)(Card as any)
