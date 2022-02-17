import styled from '@emotion/styled'
import { Box, Button, TextField, Typography } from '@mui/material'
import { withStyles } from '@mui/styles'
import { CheckCircle, Error, Info } from '@mui/icons-material'

export const LoginTextField = withStyles({
  root: {
    marginBottom: '10px',
    width: '100%',

    '& label': {
      // color: "#2E2E2E",
      color: '#AEAEAE',
    },
    '& label.Mui-focused': {
      color: '#AEAEAE',
    },
    '& .MuiInput-underline:after': {
      borderBottom: '1px solid #AEAEAE',
    },
    '& .MuiInput-underline:before': {
      borderBottom: '1px solid #2E2E2E',
    },
  },
})(TextField) as typeof TextField

export const WelcomeText = styled.span`
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 30px;
  text-align: center;
  letter-spacing: -0.08em;
  color: #212121;
  margin: 10px 0 30px;
`

export const LoginBoxFooter = withStyles(() => ({
  root: {
    display: 'grid',
    justifyContent: 'space-between',
    width: '100%',
    gridAutoFlow: 'column',
    alignItems: 'end',
    alignSelf: 'end',
    marginTop: '2em',
  },
}))(Box) as typeof Box

const AlertBarText = withStyles(() => ({
  root: {
    position: 'absolute',
    marginTop: '1em',
    left: '1em',
    right: '1em',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    color: 'white',
    fontSize: '0.75rem',
    lineHeight: '1.95em',
    border: '1px solid transparent',
    borderRadius: '4px',
    padding: '0.5em 1em 0.5em 0.6875em',
    boxShadow: '2px 2px 3px 0px rgba(0,0,0,0.25)',
    '&.error': {
      borderColor: '#f44336;',
      backgroundColor: '#f44336;',
    },
    '&.warning': {
      borderColor: '#ff9800',
      backgroundColor: '#ff9800',
    },
    '&.info': {
      borderColor: '#2196f3',
      backgroundColor: '#2196f3',
    },
    '&.success': {
      borderColor: '#4caf50',
      backgroundColor: '#4caf50',
    },
    '&.none': {
      borderColor: 'white',
      backgroundColor: 'white',
      color: 'black',
    },
    '&.relative': {
      position: 'relative',
      left: 'auto',
      right: 'auto',
      marginBottom: '2em',
      width: '100%',
    },
  },
}))(Box)

type AlertBarProps = {
  type?: 'error' | 'warning' | 'info' | 'success' | 'none'
  title?: string
  message?: string
  showLoader?: boolean
  buttonText?: string | boolean
  buttonLink?: string
  positionRelative?: boolean
  onClick?: React.MouseEventHandler
}

export function AlertBar({
  type = 'error',
  message = 'We apologize, but an error has been encountered. Please try again.',
  showLoader = false,
  buttonText = false,
  buttonLink = '',
  positionRelative = true,
  onClick = () => {},
}: AlertBarProps) {
  return (
    <AlertBarText
      className={type + (positionRelative ? ' relative' : 'absolute')}
    >
      <div>
        {type === 'success' ? (
          <CheckCircle style={{ verticalAlign: 'middle' }} />
        ) : type === 'error' ? (
          <Error style={{ verticalAlign: 'middle' }} />
        ) : (
          <Info style={{ verticalAlign: 'middle' }} />
        )}
      </div>
      <div style={{ marginLeft: '10px', flexGrow: 1 }}>{message}</div>
      {buttonText && (
        <Typography align="center">
          {buttonLink ? (
            <Button
              href={buttonLink}
              size="small"
              color="primary"
              variant="contained"
            >
              {buttonText}
            </Button>
          ) : (
            <Button
              onClick={onClick}
              size="small"
              color="primary"
              variant="contained"
            >
              {buttonText}
            </Button>
          )}
        </Typography>
      )}
    </AlertBarText>
  )
}
