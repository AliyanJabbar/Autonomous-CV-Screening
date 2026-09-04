"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(null)

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative inline-block text-left" data-slot="dropdown-menu">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({
  asChild,
  children,
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const context = React.useContext(DropdownMenuContext)

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    context?.setOpen((prev) => !prev)
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void; className?: string }>, {
      onClick: (e: React.MouseEvent) => {
        (children.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e)
        context?.setOpen((prev) => !prev)
      },
    })
  }

  return (
    <button
      type="button"
      data-slot="dropdown-menu-trigger"
      onClick={toggle}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DropdownMenuContent({
  className,
  align = "end",
  sideOffset = 4,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" | "end"; sideOffset?: number }) {
  const context = React.useContext(DropdownMenuContext)
  if (!context?.open) return null

  const alignStyles = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  return (
    <div
      data-slot="dropdown-menu-content"
      style={{ marginTop: sideOffset }}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md bg-popover text-popover-foreground animate-in fade-in-80 zoom-in-95",
        alignStyles[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dropdown-menu-group" className={cn("py-1", className)} {...props} />
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  onClick,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean; variant?: "default" | "destructive" }) {
  const context = React.useContext(DropdownMenuContext)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e)
    context?.setOpen(false)
  }

  return (
    <div
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground data-[variant=destructive]:text-destructive data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { checked?: boolean }) {
  const context = React.useContext(DropdownMenuContext)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e)
    context?.setOpen(false)
  }

  return (
    <div
      data-slot="dropdown-menu-checkbox-item"
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked && (
          <svg className="size-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {children}
    </div>
  )
}

function DropdownMenuRadioGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dropdown-menu-radio-group" className={className} {...props} />
}

function DropdownMenuRadioItem({
  className,
  children,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(DropdownMenuContext)
  return (
    <div
      data-slot="dropdown-menu-radio-item"
      onClick={(e) => {
        onClick?.(e)
        context?.setOpen(false)
      }}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  )
}

function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>
}

function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuSubContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
