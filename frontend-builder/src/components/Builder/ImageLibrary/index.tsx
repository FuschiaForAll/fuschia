import React, { useEffect, useRef, useState } from 'react'
import Modal from '@mui/material/Modal'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  TextField,
} from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  OnAssetChangeDocument,
  OnAssetChangeSubscriptionResult,
  useCreateAssetFolderMutation,
  useListAssetFolderQuery,
  useUploadAssetMutation,
} from '../../../generated/graphql'
import { ArrowRight, Folder, Description } from '@mui/icons-material'

interface FolderStructure {
  [key: string]: null | FolderStructure
}

const initialState = {
  mouseX: null,
  mouseY: null,
}

function buildNestedStructure(keys: string[]) {
  return keys.reduce((obj, key) => {
    let branch = obj
    const parts = key.split('/')
    while (parts.length) {
      const part = parts.shift()
      if (part) {
        if (!branch[part]) {
          branch[part] = parts.length > 0 ? {} : null
        }
        if (branch[part] !== null) {
          branch = branch[part] as FolderStructure
        }
      }
    }
    return obj
  }, {} as FolderStructure)
}

const ImageLibrary = function ImageLibrary() {
  let location = useLocation()
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string; extra: string }>()
  const fileUploadRef = useRef<HTMLInputElement>(null)
  const [keys, setKeys] = useState<string[]>([])
  const [folderData, setFolderData] = useState<FolderStructure>({})
  const [currentFolderContents, setCurrentFolderContents] = useState<
    Array<{ title: string; isFolder: boolean }>
  >([])
  const [dragging, useDragging] = useState(false)
  const [showNewFolder, showNewFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [contextItem, setContextItem] = useState<File | undefined>()
  const [currentFolderPath, setCurrentFolderPath] = useState<string[]>([])
  const [error] = useState<string>()
  const [state, setState] = React.useState<{
    mouseX: null | number
    mouseY: null | number
  }>(initialState)
  const { subscribeToMore, data: FilesData } = useListAssetFolderQuery({
    variables: {
      projectId,
    },
  })
  const [uploadAsset] = useUploadAssetMutation()
  const [createAssetFolder] = useCreateAssetFolderMutation()
  let dragCounter = 0
  useEffect(() => {
    subscribeToMore({
      document: OnAssetChangeDocument,
      variables: { projectId },
      updateQuery: (prev, { subscriptionData }) => {
        const subData =
          subscriptionData as unknown as OnAssetChangeSubscriptionResult
        if (subData.data) {
          switch (subData.data.onAssetChange.type) {
            case 'CREATE':
              return {
                ...prev,
                listAssetFolder: prev.listAssetFolder.concat(
                  subData.data.onAssetChange.assets
                ),
              }
            case 'UPDATE':
              const newAssets = [...prev.listAssetFolder]
              subData.data.onAssetChange.assets.forEach(c => {
                const toupdate = newAssets.findIndex(nc => nc._id === c._id)
                if (toupdate > -1) {
                  newAssets[toupdate] = c
                }
              })
              return {
                ...prev,
                listAssetFolder: newAssets,
              }
            case 'DELETE':
              const data = subData.data
              return {
                ...prev,
                listAssetFolder: prev.listAssetFolder.filter(
                  c => !data.onAssetChange._ids.includes(c._id)
                ),
              }
          }
        }
        return prev
      },
    })
  }, [projectId, subscribeToMore])
  useEffect(() => {
    const currentFolderObject = currentFolderPath
      .slice(2, -1)
      .reduce((obj, path) => {
        if (obj) {
          return obj[path]
        } else {
          return null
        }
      }, folderData as FolderStructure | null)
    if (currentFolderObject) {
      setCurrentFolderContents(
        Object.keys(currentFolderObject).map(key => ({
          title: key,
          isFolder: !!currentFolderObject[key],
        }))
      )
    } else {
      setCurrentFolderContents([])
    }
  }, [currentFolderPath, keys, folderData])

  useEffect(() => {
    if (FilesData) {
      const keyArray = FilesData.listAssetFolder.map(file => file.key)
      setKeys(keyArray)
      setFolderData(buildNestedStructure(keyArray))
    }
  }, [FilesData])

  useEffect(() => {
    const folderPath = location.pathname.split('/')
    folderPath.shift()
    folderPath.shift()
    folderPath.shift()
    if (folderPath[folderPath.length - 1] !== '') {
      folderPath.push('')
    }
    setCurrentFolderPath(folderPath)
  }, [location, projectId])

  function handleNewFolderClose() {
    setNewFolderName('')
    showNewFolderOpen(false)
  }
  const handleClick = (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    event.preventDefault()
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    })
  }
  const DragEnterHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter++
    const dataTransfer = e.dataTransfer
    useDragging(drag => {
      if (dataTransfer && dataTransfer.items && dataTransfer.items.length > 0) {
        return true
      }
      return drag
    })
  }

  const DragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter--
    useDragging(drag => {
      if (dragCounter !== 0) {
        return false
      }
      return drag
    })
  }

  const DropEventHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    useDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files
      const folder = currentFolderPath.slice(2, -1).join('/')
      uploadAsset({
        variables: {
          projectId,
          folder,
          file: files[0],
        },
      })
      e.dataTransfer.clearData()
      dragCounter = 0
    }
  }

  const handleClose = () => {
    setContextItem(undefined)
    setState(initialState)
  }
  if (error) {
    return <div>The requested folder does not exist.</div>
  }
  return (
    <Modal open={true} onClose={() => navigate('../')} sx={{ padding: '5rem' }}>
      <Paper
        sx={{
          height: '100%',
          width: '100%',
          padding: '1rem',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
        }}
      >
        <div
          onDragOver={e => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onDragEnter={DragEnterHandler}
          onDragLeave={DragLeaveHandler}
          onDrop={DropEventHandler}
          onContextMenu={handleClick}
        >
          {!dragging && (
            <div
              style={{
                border: 'dashed grey 1px',
                minHeight: '250px',
                minWidth: '350px',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <List>
                <ListItem>
                  <div
                    style={{
                      display: 'grid',
                      justifyContent: 'space-between',
                      gridAutoFlow: 'column',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        justifyContent: 'start',
                        gap: '1em',
                        gridAutoFlow: 'column',
                      }}
                    >
                      {currentFolderPath.slice(1, -1).map((p, idx) => (
                        <React.Fragment key={idx}>
                          <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              const newPath = currentFolderPath.slice(
                                0,
                                idx + 2
                              )
                              navigate(
                                `/projects/${projectId}/${newPath.join('/')}`
                              )
                            }}
                          >
                            {p}
                          </div>
                          <div>/</div>
                        </React.Fragment>
                      ))}
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => showNewFolderOpen(true)}
                      >
                        Create Folder
                      </Button>
                    </div>
                  </div>
                </ListItem>
                {currentFolderPath.length > 3 ? (
                  <>
                    <Divider />
                    <ListItem
                      button
                      onClick={() => {
                        const path = JSON.parse(
                          JSON.stringify(currentFolderPath)
                        )
                        path.pop()
                        path.pop()
                        path.pop()
                        path.pop()
                        path.pop()
                        navigate(
                          `/projects/${projectId}/builder/asset-library/${path.join(
                            '/'
                          )}`
                        )
                      }}
                    >
                      <ListItemText>..</ListItemText>
                    </ListItem>
                  </>
                ) : (
                  <></>
                )}
                {currentFolderContents
                  .sort(
                    (a, b) =>
                      +!a.isFolder - +!b.isFolder ||
                      a.title.localeCompare(b.title)
                  )
                  .map(({ title, isFolder }) => (
                    <React.Fragment key={`${location}${title}`}>
                      <Divider />
                      <ListItem
                        button
                        onClick={() => {
                          const path = JSON.parse(
                            JSON.stringify(currentFolderPath)
                          )
                          path[path.length - 1] = title
                          if (isFolder) {
                            navigate(`/projects/${projectId}/${path.join('/')}`)
                          } else {
                            window.open(
                              `/project-files/${path.slice(2, -1).join('/')}`
                            )
                          }
                        }}
                      >
                        {isFolder && <ArrowRight />}

                        <ListItemIcon>
                          {isFolder ? <Folder /> : <Description />}
                        </ListItemIcon>
                        <ListItemText primary={title} />
                      </ListItem>
                    </React.Fragment>
                  ))}
                <Divider />
              </List>
              Drag and drop here, or{' '}
              <Link onClick={() => fileUploadRef.current?.click()}>Browse</Link>
              <input
                hidden={true}
                ref={fileUploadRef}
                onChange={e => {
                  if (e.target.files) {
                    const files = e.target.files
                    const folder = currentFolderPath.slice(2, -1).join('/')
                    uploadAsset({
                      variables: {
                        projectId,
                        folder,
                        file: files[0],
                      },
                    })
                  }
                }}
                type="file"
                id="myFile"
                name="filename"
              />
            </div>
          )}
          {dragging && (
            <div
              style={{
                border: 'dashed grey 4px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  left: 0,
                  textAlign: 'center',
                  color: 'grey',
                  fontSize: 36,
                }}
              >
                <div>drop here :)</div>
              </div>
            </div>
          )}
          <Menu
            keepMounted
            open={state.mouseY !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              state.mouseY !== null && state.mouseX !== null
                ? { top: state.mouseY, left: state.mouseX }
                : undefined
            }
          >
            <MenuItem
              onClick={() => {
                showNewFolderOpen(true)
                handleClose()
              }}
            >
              New Folder
            </MenuItem>
            {contextItem && (
              <>
                <MenuItem onClick={handleClose}>Rename</MenuItem>
                <MenuItem onClick={handleClose}>Move</MenuItem>
                <Divider />
                <MenuItem onClick={handleClose}>Delete</MenuItem>
              </>
            )}
          </Menu>
          <Dialog
            open={showNewFolder}
            onClose={handleNewFolderClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Create a new folder
            </DialogTitle>
            <DialogContent>
              <TextField
                value={newFolderName}
                onChange={e => {
                  const name = e.currentTarget.value
                  setNewFolderName(name)
                }}
                autoFocus
                id="folderName"
                label="Folder name"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNewFolderClose} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const folderName = [
                    ...currentFolderPath.slice(2, -1),
                    newFolderName,
                  ]
                  createAssetFolder({
                    variables: {
                      projectId,
                      folderName: `${folderName.join('/')}/`,
                    },
                  })
                  handleNewFolderClose()
                }}
                variant="contained"
                color="primary"
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Paper>
    </Modal>
  )
}

export default ImageLibrary
