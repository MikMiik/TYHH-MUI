import React, { useState, useCallback, useMemo } from 'react'
import { Box, Chip, IconButton, Tooltip, CircularProgress } from '@mui/material'
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
      // Check if this is a loading/combining entity
      if (item.data.isLoading) {
        return (
          <Chip
            icon={<CircularProgress size={16} sx={{ color: 'inherit' }} />}
            label={item.data.name}
            sx={{
              boxShadow: 2,
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
            }}
          />
        )
      }

      // Entity chip shows name (not formula)
      const chipElement = (
        <Box
          sx={{
            position: 'relative',
            display: 'inline-block',
          }}
        >
          {/* Rotating rays effect for new combinations */}
          {item.isNewCombination && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '110px',
                height: '110px',
                pointerEvents: 'none',
                zIndex: -1,
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100%',
                  height: '100%',
                  transform: 'translate(-50%, -50%)',
                  background: `
                    linear-gradient(0deg, transparent 40%, rgba(76, 175, 80, 0.6) 47%, rgba(76, 175, 80, 0.8) 50%, rgba(76, 175, 80, 0.6) 53%, transparent 60%),
                    linear-gradient(45deg, transparent 40%, rgba(56, 142, 60, 0.5) 47%, rgba(56, 142, 60, 0.7) 50%, rgba(56, 142, 60, 0.5) 53%, transparent 60%),
                    linear-gradient(90deg, transparent 40%, rgba(76, 175, 80, 0.6) 47%, rgba(76, 175, 80, 0.8) 50%, rgba(76, 175, 80, 0.6) 53%, transparent 60%),
                    linear-gradient(135deg, transparent 40%, rgba(56, 142, 60, 0.5) 47%, rgba(56, 142, 60, 0.7) 50%, rgba(56, 142, 60, 0.5) 53%, transparent 60%)
                  `,
                  filter: 'blur(3px)',
                  animation: 'rotateRays 2s linear forwards',
                  opacity: 0,
                },
                '&::after': {
                  animationDelay: '1.5s',
                },
                '@keyframes rotateRays': {
                  '0%': {
                    transform: 'translate(-50%, -50%) rotate(0deg) scale(0.5)',
                    opacity: 0,
                  },
                  '15%': {
                    opacity: 0.9,
                  },
                  '85%': {
                    opacity: 0.9,
                  },
                  '100%': {
                    transform: 'translate(-50%, -50%) rotate(360deg) scale(1.1)',
                    opacity: 0,
                  },
                },
              }}
            />
          )}
          
          {/* Sparkle particles */}
          {item.isNewCombination && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(76, 175, 80, 0.9)',
                    boxShadow: '0 0 10px rgba(76, 175, 80, 0.9)',
                    filter: 'blur(1px)',
                    pointerEvents: 'none',
                    animation: `sparkle${i} 2s ease-out forwards`,
                    animationDelay: `${i * 0.3}s`,
                    '@keyframes sparkle0': {
                      '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)', opacity: 0 },
                      '30%': { opacity: 1 },
                      '100%': { transform: 'translate(-50%, -50%) translate(40px, 0px) scale(0.5)', opacity: 0 },
                    },
                    '@keyframes sparkle1': {
                      '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)', opacity: 0 },
                      '30%': { opacity: 1 },
                      '100%': { transform: 'translate(-50%, -50%) translate(0px, 40px) scale(0.5)', opacity: 0 },
                    },
                    '@keyframes sparkle2': {
                      '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)', opacity: 0 },
                      '30%': { opacity: 1 },
                      '100%': { transform: 'translate(-50%, -50%) translate(-40px, 0px) scale(0.5)', opacity: 0 },
                    },
                    '@keyframes sparkle3': {
                      '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)', opacity: 0 },
                      '30%': { opacity: 1 },
                      '100%': { transform: 'translate(-50%, -50%) translate(0px, -40px) scale(0.5)', opacity: 0 },
                    },
                  }}
                />
              ))}
            </>
          )}

          <Chip
            label={`${item.data.icon || '🧪'} ${item.data.name}`}
            sx={{
              boxShadow: 2,
              bgcolor: item.isNewCombination ? 'success.main' : 'secondary.main',
              color: 'secondary.contrastText',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </Box>
      )

      // Canvas tooltip shows description
      if (item.data.description) {
        return (
          <Tooltip
            title={item.data.description}
            arrow
            enterDelay={1500} // 1.5s delay
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
