"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import type { ProctorEventType } from "@/lib/types"

interface UseProctoringOptions {
  enabled: boolean
  onViolation: (type: ProctorEventType, description: string) => void
}

interface ProctoringState {
  tabSwitches: number
  focusLosses: number
  rightClicks: number
  copyPastes: number
  fullscreenExits: number
  keyCombos: number
  totalViolations: number
  isFullscreen: boolean
}

export function useProctoring({ enabled, onViolation }: UseProctoringOptions) {
  const [proctoringState, setProctoringState] = useState<ProctoringState>({
    tabSwitches: 0,
    focusLosses: 0,
    rightClicks: 0,
    copyPastes: 0,
    fullscreenExits: 0,
    keyCombos: 0,
    totalViolations: 0,
    isFullscreen: false,
  })

  const onViolationRef = useRef(onViolation)
  onViolationRef.current = onViolation

  const recordViolation = useCallback((type: ProctorEventType, description: string) => {
    onViolationRef.current(type, description)
    setProctoringState((prev) => {
      const key =
        type === "tab_switch"
          ? "tabSwitches"
          : type === "focus_loss"
            ? "focusLosses"
            : type === "right_click"
              ? "rightClicks"
              : type === "copy_paste"
                ? "copyPastes"
                : type === "fullscreen_exit"
                  ? "fullscreenExits"
                  : "keyCombos"
      return {
        ...prev,
        [key]: prev[key] + 1,
        totalViolations: prev.totalViolations + 1,
      }
    })
  }, [])

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen()
      setProctoringState((prev) => ({ ...prev, isFullscreen: true }))
    } catch {
      // Fullscreen not supported or denied
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Tab visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation("tab_switch", "Student switched to another tab")
      }
    }

    // Window focus/blur
    const handleBlur = () => {
      recordViolation("focus_loss", "Browser window lost focus")
    }

    // Right-click prevention
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      recordViolation("right_click", "Right-click attempted during exam")
    }

    // Copy/Cut/Paste prevention
    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault()
      recordViolation("copy_paste", `${e.type} attempted during exam`)
    }

    // Keyboard shortcuts prevention
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+P, PrintScreen
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x", "a", "p"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault()
        recordViolation("key_combo", `Keyboard shortcut ${e.ctrlKey ? "Ctrl" : "Cmd"}+${e.key.toUpperCase()} attempted`)
      }
      if (e.key === "PrintScreen") {
        e.preventDefault()
        recordViolation("key_combo", "PrintScreen key attempted")
      }
      // Prevent F12 (Dev Tools)
      if (e.key === "F12") {
        e.preventDefault()
        recordViolation("key_combo", "F12 (DevTools) attempted")
      }
    }

    // Fullscreen change detection
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setProctoringState((prev) => ({ ...prev, isFullscreen: false }))
        recordViolation("fullscreen_exit", "Exited fullscreen mode")
      } else {
        setProctoringState((prev) => ({ ...prev, isFullscreen: true }))
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("copy", handleCopyPaste)
    document.addEventListener("cut", handleCopyPaste)
    document.addEventListener("paste", handleCopyPaste)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("copy", handleCopyPaste)
      document.removeEventListener("cut", handleCopyPaste)
      document.removeEventListener("paste", handleCopyPaste)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [enabled, recordViolation])

  return { proctoringState, enterFullscreen }
}
