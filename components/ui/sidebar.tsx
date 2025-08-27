"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const sidebarVariants = cva("relative flex h-full w-full flex-col overflow-hidden border-r bg-background", {
  variants: {
    size: {
      sm: "w-64",
      default: "w-72",
      lg: "w-80",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  collapsed?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({ className, size, collapsed, ...props }, ref) => (
  <div
    ref={ref}
    data-collapsed={collapsed}
    className={cn(sidebarVariants({ size }), collapsed && "w-16 [&_[data-collapsed-hide]]:hidden", className)}
    {...props}
  />
))
Sidebar.displayName = "Sidebar"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-1 flex-col overflow-hidden", className)} {...props} />
  ),
)
SidebarContent.displayName = "SidebarContent"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-14 items-center border-b px-4", className)} {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-14 items-center border-t px-4", className)} {...props} />
  ),
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("py-2", className)} {...props} />,
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 py-1 text-xs font-medium text-muted-foreground", className)} {...props} />
  ),
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("pb-1", className)} {...props} />,
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("grid gap-1 px-2", className)} {...props} />,
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("grid", className)} {...props} />,
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean
  }
>(({ className, isActive, ...props }, ref) => (
  <button
    ref={ref}
    data-active={isActive}
    className={cn(
      "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none hover:bg-muted data-[active=true]:bg-muted data-[active=true]:text-foreground",
      className,
    )}
    {...props}
  />
))
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuSub = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("ml-4 grid gap-1", className)} {...props} />,
)
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "ml-auto flex h-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium",
        className,
      )}
      {...props}
    />
  ),
)
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("absolute inset-y-0 right-0 w-[1px] bg-border", className)} {...props} />
  ),
)
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-1 flex-col overflow-auto", className)} {...props} />
  ),
)
SidebarInset.displayName = "SidebarInset"

const SidebarProvider = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex h-full", className)} {...props} />,
)
SidebarProvider.displayName = "SidebarProvider"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
      {...props}
    />
  ),
)
SidebarTrigger.displayName = "SidebarTrigger"

export {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuBadge,
  SidebarRail,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
}

