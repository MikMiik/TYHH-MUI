import React, { useState, useCallback, useEffect } from 'react'
import {
  Box,
  Chip,
  Stack,
  IconButton,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Button,
  Tooltip,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import SearchIcon from '@mui/icons-material/Search'
import ThemeToggle from '@/components/ThemeToggle'
import CanvasItem from '@/components/CanvasItem'
import ParticlesBackground from '@/components/ParticlesBackground'
import {
  useGetAllElementsQuery,
  useGetUserEntitiesQuery,
  useCombineElementsMutation,
} from '@/features/api/playgroundApi'
import { DndContext, DragOverlay, useDroppable, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

function Playground() {
  const theme = useTheme()

  const isDarkMode = theme.palette.mode === 'dark'

  const [activeTab, setActiveTab] = useState('elements')
  const [canvasItems, setCanvasItems] = useState([])
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })
  const [activeId, setActiveId] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [searchQuery, setSearchQuery] = useState('')

  const { data: elements = [], isLoading: elementsLoading, isError: elementsError } = useGetAllElementsQuery()
  const { data: entities = [], isLoading: entitiesLoading, isError: entitiesError } = useGetUserEntitiesQuery()
  const [combineElements] = useCombineElementsMutation()

  const loading = activeTab === 'elements' ? elementsLoading : entitiesLoading
  const isError = activeTab === 'elements' ? elementsError : entitiesError

  // Load canvas items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('playgroundCanvasItems')
    if (saved) {
      try {
        const items = JSON.parse(saved)
        // Filter out any items with invalid structure (from old format)
        const validItems = items.filter((item) => item && item.id && item.type && item.data && item.position)
        setCanvasItems(validItems)
      } catch (e) {
        console.error('Failed to parse canvas items:', e)
        localStorage.removeItem('playgroundCanvasItems')
      }
    }
  }, [])

  // Save canvas items to localStorage whenever they change
  useEffect(() => {
    if (canvasItems.length > 0) {
      localStorage.setItem('playgroundCanvasItems', JSON.stringify(canvasItems))
    } else {
      // Remove from localStorage when canvas is empty
      localStorage.removeItem('playgroundCanvasItems')
    }
  }, [canvasItems])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Small distance - drag starts quickly
      },
    })
  )

  // Check if a position collides with existing items
  const checkCollision = useCallback((x, y, items, threshold = 80) => {
    return items.some((item) => {
      const dx = item.position.x - x
      const dy = item.position.y - y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance < threshold
    })
  }, [])

  // Find nearest non-colliding position using spiral algorithm
  const findNonCollidingPosition = useCallback(
    (centerX, centerY, items) => {
      // Start at center
      let x = centerX
      let y = centerY

      // If center is free, use it
      if (!checkCollision(x, y, items)) {
        return { x, y }
      }

      // Spiral outward to find free position
      const step = 60 // Distance between check points
      let angle = 0
      let radius = step

      // Try up to 50 positions in spiral
      for (let i = 0; i < 50; i++) {
        x = centerX + radius * Math.cos(angle)
        y = centerY + radius * Math.sin(angle)

        if (!checkCollision(x, y, items)) {
          return { x, y }
        }

        // Increment angle for spiral
        angle += Math.PI / 4 // 45 degrees
        
        // Increase radius every full rotation
        if (angle >= Math.PI * 2) {
          angle = 0
          radius += step
        }
      }

      // Fallback: far offset if no position found
      return {
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
      }
    },
    [checkCollision]
  )

  // Add item to canvas via click - add to true center of viewport (with collision detection)
  const handleAddToCanvas = useCallback(
    (itemData, itemType) => {
      // Get the canvas element to calculate its dimensions
      const canvasElement = document.getElementById('playground-canvas')
      if (!canvasElement) {
        console.error('Canvas element not found!')
        return
      }

      // Get canvas container dimensions
      const rect = canvasElement.getBoundingClientRect()

      // Calculate center of viewport in screen coordinates
      const screenCenterX = rect.width / 2
      const screenCenterY = rect.height / 2

      // Convert screen center to canvas coordinates
      // Canvas transform: translate(panOffset) scale(zoom) with origin (0, 0)
      // Screen position = canvasPos * zoom + panOffset
      // So: canvasPos = (screenPos - panOffset) / zoom
      const canvasX = (screenCenterX - panOffset.x) / zoom
      const canvasY = (screenCenterY - panOffset.y) / zoom

      // Find non-colliding position
      const position = findNonCollidingPosition(canvasX, canvasY, canvasItems)

      const newItem = {
        id: `${itemType}-${Date.now()}-${Math.random()}`,
        type: itemType,
        data: itemData,
        position,
      }
      setCanvasItems((prev) => [...prev, newItem])
    },
    [panOffset, zoom, canvasItems, findNonCollidingPosition]
  )

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: 'canvas-dropzone',
  })

  // Handle drag start
  const handleDragStart = useCallback((event) => {
    const { active } = event
    setActiveId(active.id)
    setDraggedItem(active.data.current)
  }, [])

  // Handle drag end - only for canvas items (move and combine)
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over, delta } = event

      const activeData = active.data.current

      // Only handle canvas items (no more menu items drag)
      // Case 1: Combining two canvas items (drop on another item)
      if (activeData.type === 'canvas-item' && over?.id && over.id.startsWith('canvas-')) {
        const activeItemId = active.id.replace('canvas-', '')
        const overItemId = over.id.replace('canvas-', '')

        // If dropping on different item, try to combine
        if (activeItemId !== overItemId) {
          const activeItem = canvasItems.find((item) => item.id === activeItemId)
          const overItem = canvasItems.find((item) => item.id === overItemId)

          if (activeItem && overItem) {
            // Calculate midpoint for the new entity
            const midX = (activeItem.position.x + overItem.position.x) / 2
            const midY = (activeItem.position.y + overItem.position.y) / 2

            // Create temporary "Combining" entity with loading state
            const tempId = `temp-combining-${Date.now()}`
            const tempCombiningItem = {
              id: tempId,
              type: 'entity',
              data: {
                isElement: false,
                name: 'Combining',
                icon: '⏳', // Loading icon
                isLoading: true, // Flag to show CircularProgress
              },
              position: { x: midX, y: midY },
            }

            // IMMEDIATELY: Remove the two items and add temporary combining entity
            setCanvasItems((prev) => {
              const filtered = prev.filter((item) => item.id !== activeItemId && item.id !== overItemId)
              return [...filtered, tempCombiningItem]
            })

            // Store original items for rollback if needed
            const originalItems = [activeItem, overItem]

            // Get element names for API call
            const element1 = activeItem.type === 'element' ? activeItem.data.symbol : activeItem.data.name
            const element2 = overItem.type === 'element' ? overItem.data.symbol : overItem.data.name

            // Call API to combine
            combineElements({ element1, element2 })
              .unwrap()
              .then((result) => {
                // SUCCESS: Replace temp entity with real entity
                const realItemId = `entity-${result.entity.id}-${Date.now()}`
                const realItem = {
                  id: realItemId,
                  type: 'entity',
                  data: {
                    isElement: false,
                    id: result.entity.id,
                    name: result.entity.name,
                    icon: result.entity.icon,
                    formula: result.entity.formula,
                    description: result.entity.description,
                  },
                  position: { x: midX, y: midY },
                  isNewCombination: result.isNew,
                }

                setCanvasItems((prev) => prev.map((item) => (item.id === tempId ? realItem : item)))

                // If it's a new combination, remove the glow effect after 3s
                if (result.isNew) {
                  setTimeout(() => {
                    setCanvasItems((prev) =>
                      prev.map((item) =>
                        item.id === realItemId
                          ? { ...item, isNewCombination: false }
                          : item
                      )
                    )
                  }, 2000)
                }
              })
              .catch((error) => {
                console.error('❌ Failed to combine:', error)
                
                // ERROR: Remove temp entity and restore original items
                setCanvasItems((prev) => {
                  const filtered = prev.filter((item) => item.id !== tempId)
                  return [...filtered, ...originalItems]
                })

                setSnackbar({
                  open: true,
                  message: `Failed to combine: ${error?.data?.message || error.message || 'Unknown error'}`,
                  severity: 'error',
                })
              })

            setActiveId(null)
            setDraggedItem(null)
            return // Don't move item after combining
          }
        }
      }

      // Case 2: Moving existing canvas item (always move if dragging canvas item)
      if (activeData.type === 'canvas-item' && (delta.x !== 0 || delta.y !== 0)) {
        const itemId = active.id.replace('canvas-', '')
        setCanvasItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  position: {
                    x: item.position.x + delta.x / zoom,
                    y: item.position.y + delta.y / zoom,
                  },
                }
              : item
          )
        )
      }

      setActiveId(null)
      setDraggedItem(null)
    },
    [canvasItems, zoom, combineElements]
  )

  // Handle canvas panning with mouse
  const handleCanvasMouseDown = useCallback(
    (e) => {
      // Only pan when clicking on canvas background (not on items)
      if (e.button === 0) {
        // Check if we're clicking on a canvas item
        const isOnCanvasItem = e.target.closest('.MuiChip-root')

        if (!isOnCanvasItem) {
          setIsPanning(true)
          setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
        }
      }
    },
    [panOffset]
  )

  const handleCanvasMouseMove = useCallback(
    (e) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - startPan.x,
          y: e.clientY - startPan.y,
        })
      }
    },
    [isPanning, startPan]
  )

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e) => {
    const delta = e.deltaY * -0.001
    setZoom((prevZoom) => Math.min(Math.max(0.3, prevZoom + delta), 2))
  }, [])

  // Remove single item from canvas
  const handleRemoveItem = useCallback((itemId) => {
    setCanvasItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  // Clear canvas
  const handleClearCanvas = useCallback(() => {
    setCanvasItems([])
    localStorage.removeItem('playgroundCanvasItems')
  }, [])

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Central play area - Canvas */}
        <Box
          id="playground-canvas"
          ref={setDroppableRef}
          component="main"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onWheelCapture={handleWheel}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 200px)',
            overflow: 'hidden',
            cursor: isPanning ? 'grabbing' : 'default',
            bgcolor: isOver ? 'action.hover' : 'background.default',
            position: 'relative',
          }}
        >
          {/* Animated particles background */}
          <ParticlesBackground isDark={isDarkMode} />

          {/* Canvas content with transform */}
          <Box
            id="canvas-content"
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              willChange: 'transform', // GPU acceleration
            }}
          >
            {/* Canvas items */}
            {canvasItems.map((item) => (
              <CanvasItem key={item.id} id={item.id} item={item} onRemove={handleRemoveItem} />
            ))}
          </Box>

          {/* Hint text when canvas is empty */}
          {canvasItems.length === 0 && !isPanning && (
            <Typography variant="h6" color="text.secondary" sx={{ pointerEvents: 'none' }}>
              Thêm các nguyên tố hoặc thực thể để kết hợp
            </Typography>
          )}
        </Box>

        {/* Bottom fixed menu area */}
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        >
          <Stack mb={1} direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" px={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant={activeTab === 'elements' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('elements')}
                color="primary"
              >
                Nguyên tố
              </Button>
              <Button
                variant={activeTab === 'entities' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('entities')}
                color="primary"
              >
                Thực thể
              </Button>
              <TextField
                size="small"
                placeholder={`Tìm kiếm ${activeTab === 'elements' ? 'nguyên tố' : 'thực thể'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 250 }}
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption">Zoom: {(zoom * 100).toFixed(0)}%</Typography>
              <ThemeToggle />
              <Tooltip title="Clear Canvas">
                <IconButton size="small" color="inherit" onClick={handleClearCanvas}>
                  <CleaningServicesIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          <Box>
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={1}
              alignItems="center"
              overflow="auto"
              sx={{
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper',
                p: 2,
                maxHeight: '20vh',
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : isError ? (
                <Typography color="error" variant="body2">
                  Lỗi tải dữ liệu
                </Typography>
              ) : activeTab === 'elements' ? (
                // Render elements - Click to add (with search filter)
                elements && elements.length > 0 ? (
                  (() => {
                    const filteredElements = elements.filter((el) => {
                      if (!searchQuery) return true
                      const query = searchQuery.toLowerCase()
                      return el.symbol.toLowerCase().includes(query) || el.name.toLowerCase().includes(query)
                    })

                    return filteredElements.length > 0 ? (
                      filteredElements.map((el) => (
                        <Tooltip key={el.symbol} title={`${el.name} - Click to add to canvas`} arrow>
                          <Chip
                            label={el.symbol}
                            onClick={() => {
                              handleAddToCanvas({ symbol: el.symbol, name: el.name }, 'element')
                            }}
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'primary.dark',
                                transform: 'scale(1.05)',
                              },
                              transition: 'all 0.2s',
                            }}
                          />
                        </Tooltip>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No elements found
                      </Typography>
                    )
                  })()
                ) : null
              ) : entities && entities.length > 0 ? (
                // Render entities - Click to add (with search filter)
                entities
                  .filter((entity) => {
                    if (!searchQuery) return true
                    const query = searchQuery.toLowerCase()
                    return (
                      entity.name.toLowerCase().includes(query) ||
                      (entity.formula && entity.formula.toLowerCase().includes(query))
                    )
                  })
                  .map((entity) => (
                    <Tooltip key={entity.id} title={entity.formula || entity.name} arrow>
                      <Chip
                        label={`${entity.icon || '🧪'} ${entity.name}`}
                        onClick={() => {
                          handleAddToCanvas(
                            {
                              id: entity.id,
                              name: entity.name,
                              icon: entity.icon,
                              formula: entity.formula,
                              description: entity.description,
                            },
                            'entity'
                          )
                        }}
                        sx={{
                          bgcolor: 'secondary.main',
                          color: 'secondary.contrastText',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'secondary.dark',
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.2s',
                        }}
                      />
                    </Tooltip>
                  ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có entity nào. Hãy combine các elements để tạo entity mới!
                </Typography>
              )}
            </Stack>
          </Box>
        </Box>

        {/* Drag overlay - Simplified for performance */}
        <DragOverlay style={{ pointerEvents: 'none' }}>
          {activeId && draggedItem && (
            <Box sx={{ pointerEvents: 'none', opacity: 0.8 }}>
              {draggedItem.type === 'menu-item' ? (
                <Chip
                  label={draggedItem.isElement ? draggedItem.symbol : `${draggedItem.icon || '🧪'} ${draggedItem.name}`}
                  sx={{
                    boxShadow: 4,
                    bgcolor: draggedItem.isElement ? 'primary.main' : 'secondary.main',
                    color: draggedItem.isElement ? 'primary.contrastText' : 'secondary.contrastText',
                  }}
                />
              ) : (
                draggedItem.item && (
                  <Chip
                    label={
                      draggedItem.item.type === 'element'
                        ? draggedItem.item.data.symbol
                        : `${draggedItem.item.data.icon || '🧪'} ${draggedItem.item.data.name}`
                    }
                    sx={{
                      boxShadow: 4,
                      bgcolor: draggedItem.item.type === 'element' ? 'primary.main' : 'secondary.main',
                      color: draggedItem.item.type === 'element' ? 'primary.contrastText' : 'secondary.contrastText',
                    }}
                  />
                )
              )}
            </Box>
          )}
        </DragOverlay>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </DndContext>
  )
}

export default Playground
