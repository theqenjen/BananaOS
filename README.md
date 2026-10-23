# BananaOS

BananaOS is a 32-bit hobby operating system kernel, written in C and NASM,
booted via GRUB/multiboot2 and run in QEMU.

## Build

Requires a Linux toolchain (gcc-multilib, nasm, xorriso, grub2, qemu).

```
cd kernel
make            # builds bananaos.iso
make run        # boots it in QEMU (serial -> stdout)
```

## Run in this sandbox

```
docker compose -f docker-compose.base44.yml up -d --build
```

The container builds the ISO, boots it in headless QEMU, and serves the
kernel's serial output live at http://localhost:3000 so you can watch it boot
in a browser. Restart the service to rebuild after editing kernel sources.
