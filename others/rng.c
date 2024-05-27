#include <math.h>
#include <stdio.h>

//file managers
#include <stdlib.h>

unsigned short rng_function(unsigned short input)
{
    if (input == 0x56A)
        input = 0;
    unsigned short S0 = (unsigned char)input << 8;
    S0 = S0 ^ input;
    input = ((S0 & 0xFF) << 8) | ((S0 & 0xFF00) >> 8);
    S0 = ((unsigned char)S0 << 1) ^ input;
    short S1 = (S0 >> 1) ^ 0xFF80;
    if ((S0 & 1) == 0)
    {
        if (S1 == 0xAA55)
            input = 0;
        else
            input = S1 ^ 0x1FF4;
    }
    else
        input = S1 ^ 0x8180;
    return (unsigned short)input;
}

int main(int argc, char *argv[])
{
    // TEST MARIO 64 RNG FUNCTION
    FILE *file = fopen("rng.txt", "w");

    unsigned short rng = 1500;
    for (int i = 0; i < 0xFFFF; i++)
    {
        rng = rng_function(rng);
        fprintf(file, "%5o ", rng);
    }

    fclose(file);
    printf("File created\n");
    return 0;
}