// import { useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'

// import AgentButton from './AgentButton'
// import AgentPanel from './AgentPanel'

// function AgentWidget() {
//   const [open, setOpen] = useState(false)

//   const navigate = useNavigate()
//   const location = useLocation()

//   const handleToggle = () => {
//     setOpen((previous) => !previous)
//   }

//   const handleClose = () => {
//     setOpen(false)
//   }

//   const handleNavigate = (page) => {
//     const routes = {
//       dashboard: '/dashboard',
//       documents: '/documents',
//       chat: '/chat',
//       'ai-tools': '/ai-tools',
//       profile: '/profile',
//     }

//     const route = routes[page]

//     if (route) {
//       navigate(route)
//     }
//   }

//   return (
//     <>
//       {open && (
//         <AgentPanel
//           onClose={handleClose}
//           currentPage={location.pathname}
//           onNavigate={handleNavigate}
//         />
//       )}

//       <AgentButton
//         open={open}
//         onClick={handleToggle}
//       />
//     </>
//   )
// }

// export default AgentWidget
import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import AgentButton from './AgentButton'
import AgentPanel from './AgentPanel'
import { sendAgentCommand } from '../../services/agentService'

function AgentWidget() {
  const [open, setOpen] = useState(false)
  const [listening, setListening] = useState(false)

  const recognitionRef = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()

  const handleToggle = () => {
    // If currently listening, stop voice input.
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    // If panel is already open, close it.
    if (open) {
      setOpen(false)
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      // Fallback: open normal Agent panel
      setOpen(true)
      return
    }

    const recognition =
      new SpeechRecognition()

    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
    }

    recognition.onresult = async (event) => {
      const transcript =
        event.results[0][0].transcript.trim()

      if (!transcript) {
        return
      }

      try {
        const response =
          await sendAgentCommand(
            transcript,
            location.pathname
          )

        const action =
          response?.action

        if (!action) {
          // Open panel only when the command
          // cannot be automatically handled.
          setOpen(true)
          return
        }

        if (
          action.type ===
            'navigation' &&
          action.tool === 'navigate'
        ) {
          const page =
            action.parameters?.page

          const routes = {
            dashboard: '/dashboard',
            documents: '/documents',
            chat: '/chat',
            'ai-tools': '/ai-tools',
            profile: '/profile',
          }

          const route =
            routes[page]

          if (route) {
            navigate(route)
          }

          return
        }

        // For non-navigation actions,
        // open the Agent panel and pass
        // the command to it.
        setOpen(true)

        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent(
              'agent:voice-command',
              {
                detail: {
                  command: transcript,
                },
              }
            )
          )
        }, 100)
      } catch (error) {
        console.error(
          'Voice agent error:',
          error
        )

        setOpen(true)

        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent(
              'agent:voice-command',
              {
                detail: {
                  command: transcript,
                },
              }
            )
          )
        }, 100)
      }
    }

    recognition.onerror = (event) => {
      console.error(
        'Speech recognition error:',
        event.error
      )

      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }

    recognitionRef.current = recognition

    recognition.start()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleNavigate = (page) => {
    const routes = {
      dashboard: '/dashboard',
      documents: '/documents',
      chat: '/chat',
      'ai-tools': '/ai-tools',
      profile: '/profile',
    }

    const route = routes[page]

    if (route) {
      navigate(route)
    }
  }

  return (
    <>
      {open && (
        <AgentPanel
          onClose={handleClose}
          currentPage={location.pathname}
          onNavigate={handleNavigate}
        />
      )}

      <AgentButton
        open={open}
        listening={listening}
        onClick={handleToggle}
      />
    </>
  )
}

export default AgentWidget