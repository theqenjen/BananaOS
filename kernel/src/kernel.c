#include "vga.h"
#include "serial.h"

void kmain(void) {
    vga_clear();

    vga_set_color(VGA_COLOR_LIGHT_BROWN, VGA_COLOR_BLACK);
    vga_puts("===== BananaOS v0.1 =====\n");

    vga_set_color(VGA_COLOR_WHITE, VGA_COLOR_BLACK);
    vga_puts("Copyright (C) 2026 theqenjen\n\n");
    vga_puts("Initializing kernel...\n");
    vga_puts("  [+] VGA text mode\n");

    serial_init();
    serial_puts("\n===== BananaOS v0.1 =====\n");
    serial_puts("Copyright (C) 2026 theqenjen\n");
    serial_puts("Initializing kernel...\n");
    serial_puts("  [+] VGA text mode\n");
    serial_puts("  [+] Serial COM1\n");
    serial_puts("  [+] Multiboot2 boot ok\n");
    serial_puts("Kernel halted. System idle.\n");

    vga_puts("  [+] Serial COM1\n");
    vga_puts("  [+] Multiboot2 boot ok\n");
    vga_set_color(VGA_COLOR_LIGHT_GREEN, VGA_COLOR_BLACK);
    vga_puts("\nBananaOS booted successfully. Halt.\n");

    for (;;)
        __asm__ volatile ("hlt");
}
