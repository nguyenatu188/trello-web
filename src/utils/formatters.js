
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/*
xử lý bug thư viện Dnd-kit khi Column là rỗng
- phía FE sẽ tự tạo ra một cái card đặc biệt: PlaceholderCard ko liên quan đến backend
- card đặc biệt này sẽ được ẩn ở giao diện UI người dùng
- Cấu trúc Id này để Unique rất đơn giản, ko cần phải làm random phức tạp.
- "columnId-placeholer-card" (mỗi column chỉ có thể có tối đa 1 cái placeholder card)
- Quan trọng khi tạo: phải đầy đủ: (_id, boardId, columnId, FE_PlaceholderCard)
*/
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}