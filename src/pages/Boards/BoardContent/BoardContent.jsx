import { useEffect, useState, useCallback, useRef } from 'react'
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

import { DndContext,
  //PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'

import { arrayMove } from '@dnd-kit/sortable'

import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '../../../utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  // Nếu dùng PointerSensor mặc định thì phải kết họp thuộc tính CSS touch-action: none ở những phần tử kéo thả. -- nma còn bug
  //const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event.
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // chúng ta sẽ ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug.
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // cùng một thời điểm chỉ có một phần tử được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDragginCard] = useState(null)

  // điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm) (vid 37)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // tìm một cái column theo cardId
  const findColumnByCardId = (cardId) => {
    /*Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu
    cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới.*/
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi card sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      //clone mảng OrderedColumnState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // column cũ
      if (nextActiveColumn) {
        // Xóa card ở cái column active (column cũ), kéo sang column khác thì xóa ở column cũ.
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // thêm placeholder card nếu column rỗng (bị kéo hết card đi, ko còn cái nào nữa)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // cập nhật lại mảng cardOrderIds cho đúng dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // column mới
      if (nextOverColumn) {
        // Kiểm tra xem cái card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        /* Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau */
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        // xóa placeholder card đi nếu nó đang tồn tại (khi mik kéo card mới vào columb trống thì ko cần cái placeholder nữa)
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        // cập nhật lại mảng cardOrderIds cho đúng dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
    })
  }

  // Trigger khi bắt đầu kéo 1 phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // nếu là kéo card thì mới thực hiện hành động set oldColumn cho handle Drag end lấy được đúng active id.
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDragginCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger trong quá trình kéo 1 phần tử
  const handleDragOver = (event) => {
    // ko làm gì nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // con nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    const { active, over } = event

    // kiểm tra xem có vị trí kết thúc không (nếu kéo linh tinh ra ngoài) - có đang kéo thả cái gì không, ko có thì return luôn tránh lỗi.
    if (!active || !over) return

    // activeDraggingCard: là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên.
    const { id: overCardId } = over

    // Tìm 2 cái column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    //nếu không tồn tại 1 trong 2 thì ko làm gì hết, tránh crash
    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns (
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Trigger khi kết thúc hành động kéo 1 phần từ => hành động thả.
  const handleDragEnd = (event) => {
    const { active, over } = event

    // kiểm tra xem có vị trí kết thúc không (nếu kéo linh tinh ra ngoài) - có đang kéo thả cái gì không, ko có thì return luôn tránh lỗi.
    if (!active || !over) return

    // xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên.
      const { id: overCardId } = over

      // Tìm 2 cái column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      //nếu không tồn tại 1 trong 2 thì ko làm gì hết, tránh crash
      if (!activeColumn || !overColumn) return

      // kéo card qua 2 column khác nhau
      /* phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào stage từ bước handleDragStart)
      chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây là state của card đã bị
      cập nhật 1 lần rồi.*/
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // kéo thả khác column
        moveCardBetweenDifferentColumns (
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // kéo thả cùng column
        // lấy vị trí cũ
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // lấy vị trí mới
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === over.id)
        // dùng arraymove kéo card trong column tương tự logic kéo column trong board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        setOrderedColumns(prevColumns => {
          //clone mảng OrderedColumnState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnState mới
          const nextColumns = cloneDeep(prevColumns)

          // tìm tới cái column mà chúng ta đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          // cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          // trả về giá trị state mới chuẩn vị trí
          return nextColumns
        })
      }
    }

    // xử lý kéo thả column trong một cái boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // nếu vị trí sau khi kéo thả khác vị trí ban đầu
      if (active.id !== over.id) {
        // lấy vị trí cũ
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // lấy vị trí mới
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        // dùng arrayMove của dndkit để sắp xếp lại mảng Columns ban đầu
        // code của arraymove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // những dữ liệu sau khi kéo thả thành công xong hết thì đưa về giá trị null
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDragginCard(null)
  }

  /**
   * Animation khi thả phần tử - test bằng cách kéo xong thả rồi nhìn phần giữ chỗ Overlay (video 32)
   */
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  const collisionDetectionStrategy = useCallback((args) => {
    // Trường hợp kéo column thì dùng thuật toán closest corner là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tìm các điểm giao nhau, va chạm, trả về một mảng các va chạm - Intersections với con trỏ
    const pointerIntersections = pointerWithin(args)

    // Nếu pointerIntersections là mảng rỗng, return luôn không làm gì hết.
    // Fix bug: kéo card có image lớn và kéo lên trên hoặc xuống dưới ra khỏi khu vực kéo thả
    if (!pointerIntersections?.length) return

    // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây (ko cần bước này nữa)
    // const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args)

    // tìm overId đầu tiên trong pointerIntersections trên
    let overId = getFirstCollision(pointerIntersections, 'id')

    if (overId) {
      /* nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm  đó dựa vào thuật toán
      phát hiện va chạm closestCenter hoặc closestCorners đều được. Tuy nhiên ở đây dùng closestCorners thấy mượt mà hơn*/
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
      // ở đây thì overId đang là column (vì kéo card sang trước khi va chạm với card thì nó va chạm với cái column mới chứa card trước
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }
      // ở đây thì overId đã được set luôn thành cái card bỏ qua cái column

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // nếu overId là null thì trả về mảng rỗng - tránh bug crash
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      // Cảm biến (giải thích kỹ ở video 30)
      sensors={sensors}
      // Thuật toán phát hiện va chạm của dnd (nếu k có nó thì card với cover lớn sẽ ko kéo qua column được
      //vì lúc này đang bị conflict giữa card và column), ta sẽ dùng closestCorners thay vì closestCenter
      // Nếu chỉ dùng closest corner sẽ có bug flickering + sai lêch dữ liệu (video 37)
      //collisionDetection={closestCorners}

      // Tự custom nâng cao thuật toán phát hiện va chạm (video 37)
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
