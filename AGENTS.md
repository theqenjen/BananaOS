# BananaOS

A 32-bit multiboot2 kernel (C + NASM), booted by GRUB and run in QEMU.

## Architecture
- `kernel/src/boot.asm` — multiboot2 header + `_start`, sets up the stack and calls `kmain`.
- `kernel/src/kernel.c` — `kmain`: initializes VGA + serial, prints a banner, then halts.
- `kernel/src/vga.c` / `vga.h` — VGA text-mode (80x25) framebuffer driver at 0xB8000.
- `kernel/src/serial.c` / `serial.h` — COM1 serial output (38400 baud).
- `kernel/linker.ld` — links the kernel at 1 MiB, multiboot section first.
- `kernel/grub.cfg` — GRUB menu that loads the ELF via `multiboot2`.
- `kernel/Makefile` — builds `kernel.elf` then `bananaos.iso` with `grub-mkrescue`.

## Build & run (host toolchain)
```
cd kernel && make         # -> bananaos.iso
cd kernel && make run     # QEMU, serial to stdout
```
Requires: `gcc-multilib nasm xorriso grub-pc-bin grub-common mtools qemu-system-x86`.

## Sandbox (docker compose)
```
docker compose -f docker-compose.base44.yml up -d --build
```
- `Dockerfile` installs the cross-free toolchain (gcc-multilib) in the image.
- `tools/serve.py` rebuilds the ISO, boots headless QEMU (`-serial file`), and
  streams the kernel's serial output over HTTP/SSE on port 3000 so the preview
  shows the kernel booting. Restart the service to rebuild after source edits.

## Toolchain note
This uses the host `gcc -m32` (gcc-multilib) rather than a dedicated i686-elf
cross-compiler, which is fine for a starter kernel. For a production kernel,
build a true i686-elf cross-compiler (see the OSDev wiki) to avoid host libc
contamination.

## Verify
- `make` in `kernel/` produces `bananaos.iso`.
- Serial output contains `BananaOS v0.1` and `Multiboot2 boot ok`.
- `http://localhost:3000` shows the live serial log after boot.
