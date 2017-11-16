function [y] = snn_check (p, w, b)
  [m, n] = size(p);
  y = zeros(1, n);
  for i = 1:n
    a = w * p(:, i) + b;
    if a > 0
      y(i) = 1;
    endif
  endfor
endfunction
