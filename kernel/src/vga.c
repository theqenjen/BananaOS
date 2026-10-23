#include "vga.h"
#include <stddef.h>

#define VGA_WIDTH  80
#define VGA_HEIGHT 25
#define VGA_MEMORY ((volatile uint16_t *)0xB8000)

static size_t   vga_row    = 0;
static size_t   vga_col    = 0;
static uint8_t  vga_color  = 0;

static inline uint8_t vga_entry_color(enum vga_color fg, enum vga_color bg) {
    return (uint8_t)(fg | (bg << 4));
}

static inline uint16_t vga_entry(unsigned char c, uint8_t color) {
    return (uint16_t)c | ((uint16_t)color << 8);
}

static size_t kstrlen(const char *s) {
    size_t n = 0;
    while (s[n]) n++;
    return n;
}

void vga_set_color(uint8_t fg, uint8_t bg) {
    vga_color = vga_entry_color(fg, bg);
}

void vga_clear(void) {
    vga_color = vga_entry_color(VGA_COLOR_LIGHT_GREY, VGA_COLOR_BLACK);
    for (size_t i = 0; i < VGA_WIDTH * VGA_HEIGHT; i++)
        VGA_MEMORY[i] = vga_entry(' ', vga_color);
    vga_row = 0;
    vga_col = 0;
}

static void vga_newline(void) {
    vga_col = 0;
    if (++vga_row >= VGA_HEIGHT) {
        /* scroll up one line */
        for (size_t i = 0; i < (VGA_HEIGHT - 1) * VGA_WIDTH; i++)
            VGA_MEMORY[i] = VGA_MEMORY[i + VGA_WIDTH];
        for (size_t i = 0; i < VGA_WIDTH; i++)
            VGA_MEMORY[(VGA_HEIGHT - 1) * VGA_WIDTH + i] = vga_entry(' ', vga_color);
        vga_row = VGA_HEIGHT - 1;
    }
}

void vga_putc(char c) {
    if (c == '\n') { vga_newline(); return; }
    if (c == '\r') { vga_col = 0; return; }
    if (c == '\t') { c = ' '; }
    VGA_MEMORY[vga_row * VGA_WIDTH + vga_col] = vga_entry((unsigned char)c, vga_color);
    if (++vga_col >= VGA_WIDTH) vga_newline();
}

void vga_puts(const char *s) {
    for (size_t i = 0; i < kstrlen(s); i++)
        vga_putc(s[i]);
}
