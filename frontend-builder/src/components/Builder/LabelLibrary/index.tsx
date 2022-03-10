import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal'
import { Paper, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useGetLabelLibraryQuery,
  useCreateLangaugeMutation,
  useCreateLabelTagMutation,
  useCreateTranslationMutation,
  useUpdateTranslationMutation,
} from '../../../generated/graphql'

const LabelLibrary = function LabelLibrary() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const { data: labelLibraryData } = useGetLabelLibraryQuery({
    variables: {
      projectId,
    },
  })
  const [languageData, setLanguageData] = useState<{
    [language: string]: { [tag: string]: string[] }
  }>({})
  const [newLabel, setNewLabel] = useState('')
  const [createNewLanguage] = useCreateLangaugeMutation()
  const [createLabelTag] = useCreateLabelTagMutation()
  const [createTranslation] = useCreateTranslationMutation()
  const [updateTranslation] = useUpdateTranslationMutation()
  useEffect(() => {
    if (labelLibraryData && labelLibraryData.getLabelLibrary) {
      const remap = labelLibraryData.getLabelLibrary.translations.reduce(
        (acc, t) => {
          if (!acc[t.language]) {
            acc[t.language] = {}
          }
          t.translations.forEach(tag => (acc[t.language][tag.tag] = tag.value))
          console.log(acc)
          return acc
        },
        {} as { [language: string]: { [tag: string]: string[] } }
      )
      setLanguageData(remap)
    }
  }, [labelLibraryData])
  if (!labelLibraryData) {
    return <div>loading</div>
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
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            justifyContent: 'space-between',
          }}
        >
          <Typography>Label Library</Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto auto',
              gap: '0.5rem',
            }}
          ></div>
        </div>
        <div>
          <div style={{ display: 'table' }}>
            <div style={{ display: 'table-row' }}>
              <div style={{ display: 'table-cell' }}></div>
              {labelLibraryData.getLabelLibrary?.languages.map(language => (
                <div style={{ display: 'table-cell' }}>{language.name}</div>
              ))}
              <div style={{ display: 'table-cell' }}>
                <button
                  onClick={e => {
                    createNewLanguage({
                      variables: {
                        projectId,
                        languageCode: 'new',
                        languageName: 'New',
                      },
                    })
                  }}
                >
                  Add New Language
                </button>
              </div>
            </div>
            {labelLibraryData.getLabelLibrary?.labelTags.map(tag => (
              <div style={{ display: 'table-row' }} key={tag._id}>
                <div style={{ display: 'table-cell' }}>{tag.name}</div>
                {labelLibraryData.getLabelLibrary?.languages.map(language => (
                  <div style={{ display: 'table-cell' }}>
                    {languageData[language._id] &&
                    languageData[language._id][tag._id] ? (
                      <input
                        defaultValue={languageData[language._id][tag._id][0]}
                        onBlur={e => {
                          const newText = e.target.value
                          if (
                            languageData[language._id][tag._id][0] !== newText
                          ) {
                            updateTranslation({
                              variables: {
                                projectId,
                                languageId: language._id,
                                tagId: tag._id,
                                translations: [newText],
                              },
                            })
                          }
                        }}
                      />
                    ) : (
                      <input
                        onBlur={e => {
                          const newText = e.target.value
                          createTranslation({
                            variables: {
                              projectId,
                              languageId: language._id,
                              tagId: tag._id,
                              translations: [newText],
                            },
                          })
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
            <div style={{ display: 'table-row' }}>
              <div style={{ display: 'table-cell' }}>
                <input
                  value={newLabel}
                  onChange={e => {
                    const label = e.target.value
                    setNewLabel(label)
                  }}
                />
              </div>
              {labelLibraryData.getLabelLibrary?.languages.map(language => (
                <div style={{ display: 'table-cell' }}></div>
              ))}
            </div>
            <div style={{ display: 'table-cell' }}>
              <button
                onClick={e => {
                  createLabelTag({
                    variables: {
                      projectId,
                      tagName: newLabel,
                      numberOfStates: 1,
                    },
                  })
                }}
              >
                Add New Label
              </button>
            </div>
          </div>
        </div>
      </Paper>
    </Modal>
  )
}

export default LabelLibrary
