#include <stdio.h>
#include <stdlib.h>

#define WIDTH 16
#define HEIGHT 16

// declare MATRIX
unsigned short MATRIX[WIDTH * HEIGHT];

int get(int x, int y)
{
    return MATRIX[y * WIDTH + x];
}

void set(int x, int y, int value)
{
    MATRIX[y * WIDTH + x] = value;
}

void print_matrix()
{
    for (int y = 0; y < HEIGHT; y++)
    {
        for (int x = 0; x < WIDTH; x++)
        {
            printf("%1d ", get(x, y));
        }
        printf("\n");
    }
}

void generate_mines(int nmines)
{
    for (int i = 0; i < nmines; i++)
    {
        int x = rand() % WIDTH;
        int y = rand() % HEIGHT;
        while (get(x, y) == 9)
        {
            x -= 1;
            if (x < 0)
            {
                x = WIDTH - 1;
                y -= 1;
                if (y < 0)
                {
                    y = HEIGHT - 1;
                }
            }
        }
        set(x, y, 9);
    }
}

void label_mines()
{
    for (int y = 0; y < HEIGHT; y++)
    {
        for (int x = 0; x < WIDTH; x++)
        {
            if (get(x, y) == 9)
                continue;
            int count = 0;
            if (x > 0 && y > 0 && get(x - 1, y - 1) == 9)
                count++;
            if (y > 0 && get(x, y - 1) == 9)
                count++;
            if (x < WIDTH - 1 && y > 0 && get(x + 1, y - 1) == 9)
                count++;
            if (x > 0 && get(x - 1, y) == 9)
                count++;
            if (x < WIDTH - 1 && get(x + 1, y) == 9)
                count++;
            if (x > 0 && y < HEIGHT - 1 && get(x - 1, y + 1) == 9)
                count++;
            if (y < HEIGHT - 1 && get(x, y + 1) == 9)
                count++;
            if (x < WIDTH - 1 && y < HEIGHT - 1 && get(x + 1, y + 1) == 9)
                count++;
            set(x, y, count);
        }
    }
}

void init_matrix()
{
    for (int i = 0; i < WIDTH * HEIGHT; i++)
    {
        MATRIX[i] = 0;
    }
}

int main(int argc, char *arg[])
{
    printf("Mines24\n");
    init_matrix();
    generate_mines(24);
    label_mines();
    print_matrix();

    return 0;
}