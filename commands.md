## Get all listening ports and their process id
```bash
lsof -nP -iTCP -sTCP:LISTEN -FpPn | awk '
  /^p/ { pid=substr($0,2) }
  /^n/ {
    split($0,a,":")
    print pid, a[length(a)]
  }'
  ```

  ## Get command for process id
  ```bash
  ps -p 1872,1468 -o pid=,command=
  ``` 

  