# BananaOS build dependencies

Install these packages on Debian or Ubuntu:

```bash
sudo apt install build-essential gcc-aarch64-linux-gnu binutils-aarch64-linux-gnu \
  make bc flex bison libssl-dev libelf-dev libncurses-dev debootstrap \
  qemu-system-arm qemu-utils busybox-static
```

## Start the QEMU prototype

```bash
mkdir -p build
cp /usr/share/edk2/aarch64/QEMU_EFI*.fd build/
./qemu/run.sh build/rootfs.img
```

The build scripts currently provide project structure and boot configuration. They do not yet claim to produce a complete bootable Linux image.
