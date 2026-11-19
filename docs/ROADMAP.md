# BananaOS roadmap

## Phase 1: bootable base

- Build an ARM64 Linux kernel or use a distribution kernel
- Build a BusyBox initramfs
- Provide ARM64 UEFI and DTB boot paths
- Boot BananaOS in QEMU `virt`

## Phase 2: tablet shell

- Implement the shell in C
- Support DRM/KMS where available
- Fall back to Linux framebuffer
- Support touch input through evdev
- Provide Wi-Fi and display settings

## Phase 3: OOBE

- Display language and region selection
- Accept setup of an owner profile
- Configure Wi-Fi and network time
- Configure privacy permissions
- Enter the tablet shell after completion

## Phase 4: Kids Mode

- Separate child profiles
- PIN-protected adult exit
- Screen-time limits
- App allowlists
- Network and purchase restrictions
- Encrypted local profile storage

## Hardware support

Initial support uses the QEMU `virt` ARM64 machine. Later releases will add generic Linux tablet devices, primarily those with maintained ARM64 kernels and DTBs or UEFI firmware.
