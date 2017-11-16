function [w, b] = snn_teach (p, t, w, b)
  [m, n] = size(p);
  for i = 1:n
    a = w * p(:, i) + b;
    if a > 0
      y = 1;
    else
      y = 0;
    endif    
    e = t(i) - y;
    if e != 0
      b = b + e;
      w = w + e * p(:, i)';
    endif
  endfor
endfunction
