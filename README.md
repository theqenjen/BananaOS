# BananaOS

BananaOS is an ARM64 Linux tablet operating-system project. The current prototype targets QEMU's `virt` machine and normal tablet-style Linux hardware through standard Linux kernel, DTB, UEFI, and Wayland interfaces.

## Planned components

- ARM64 Linux kernel
- BusyBox userspace
- Direct framebuffer and DRM graphics support
- A C-based OOBE setup application
- A C-based Kids Mode and profile switcher
- QEMU ARM64 virtual tablet support
- Generic DT/UEFI tablet support

## Development status

This repository is currently a minimal prototype. See `docs/ROADMAP.md` for the implementation plan.
