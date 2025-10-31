import React, { useState, useCallback, useMemo } from 'react'
import { Box, Chip, IconButton, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

/**
 * Draggable AND droppable item on canvas
 * @param {string} id - Unique identifier for the item
 * @param {Object} item - Item data containing type, data, and position
 * @param {Function} onRemove - Callback function to remove item from canvas
 */
function CanvasItem({ id, item, onRemove }) {
  const [isHovered, setIsHovered] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `canvas-${id}`,
    data: { type: 'canvas-item', item },
  })

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `canvas-${id}`,
  })

  const style = useMemo(
    () => ({
      position: 'absolute',
      left: item.position.x,
      top: item.position.y,
      transform: CSS.Translate.toString(transform),
      opacity: isDragging ? 0.5 : 1,
      cursor: 'grab',
      touchAction: 'none',
      zIndex: isDragging ? 1000 : 1,
      userSelect: 'none',
      willChange: 'transform',
    }),
    [item.position.x, item.position.y, transform, isDragging]
  )

  // Combine refs for both draggable and droppable
  const setNodeRef = useCallback(
    (node) => {
      setDraggableRef(node)
      setDroppableRef(node)
    },
    [setDraggableRef, setDroppableRef]
  )

  // Render content based on item type and data
  const content = useMemo(() => {
    if (item.type === 'element') {
      return (
        <Chip label={item.data.symbol} sx={{ boxShadow: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }} />
      )
    } else {
      // Entity chip shows name (not formula)
      const chipElement = (
        <Chip
          label={`${item.data.icon || '🧪'} ${item.data.name}`}
          sx={{
            boxShadow: 2,
            bgcolor: item.isNewCombination ? 'success.main' : 'secondary.main',
            color: 'secondary.contrastText',
          }}
        />
      )

      // Canvas tooltip shows description
      if (item.data.description) {
        return (
          <Tooltip
            title={item.data.description}
            arrow
            enterDelay={500} // 0.5s delay
            placement="top"
          >
            {chipElement}
          </Tooltip>
        )
      }

      return chipElement
    }
  }, [item.type, item.data, item.isNewCombination])

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ position: 'relative' }}
    >
      {content}
      {isHovered && !isDragging && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(id)
          }}
          sx={{
            position: 'absolute',
            top: -4,
            right: -4,
            bgcolor: 'text.hint',
            color: 'white',
            width: 14,
            height: 14,
            '&:hover': {
              bgcolor: 'text.hint',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 10 }} />
        </IconButton>
      )}
    </Box>
  )
}

export default CanvasItem
