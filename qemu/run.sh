#!/bin/bash
set -eu

QEMU_BIN="${QEMU_BIN:-qemu-system-aarch64}"
UEFI_CODE="${UEFI_CODE:-/usr/share/AAVMF/AAVMF_CODE.fd}"
UEFI_VARS_TEMPLATE="${UEFI_VARS_TEMPLATE:-/usr/share/AAVMF/AAVMF_VARS.fd}"

ROOTFS="${1:-build/rootfs.img}"
UEFI_VARS="build/AAVMF_VARS.fd"

mkdir -p build
if [ ! -f "$UEFI_VARS" ]; then
  cp "$UEFI_VARS_TEMPLATE" "$UEFI_VARS"
fi

exec "$QEMU_BIN" \
  -machine virt,accel=kvm:tcg,gic-version=3 \
  -cpu max \
  -smp 4 \
  -m 2048 \
  -drive if=pflash,format=raw,readonly=on,file="$UEFI_CODE" \
  -drive if=pflash,format=raw,file="$UEFI_VARS" \
  -drive if=virtio,format=raw,file="$ROOTFS" \
  -device virtio-gpu-pci \
  -device virtio-keyboard-pci \
  -device virtio-tablet-pci \
  -device virtio-net-pci,netdev=net0 \
  -netdev user,id=net0 \
  -nographic
