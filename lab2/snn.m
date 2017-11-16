m = 2;
n = 30;

p = [-5, 7, 3, -2, 9, 5, 1, 8, -9, -3;
     1, 3, -4, 7, -3, 2, 9, -8, 4, 0];
t = [1, 0, 0, 1, 0, 0, 1, 0, 1, 1];

w = [rand(), rand()];
b = rand();

[w, b] = snn_teach(p, t, w, b)

x = input('Input x value: ');
y = input('Input y value: ');

snn_check([x;y], w, b)