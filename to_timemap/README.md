# to_timemap

## install
```
poetry install
```

## run nbdev to develop
```
poetry run jupyter notebook
```

## run production
```
poetry run python convert_timemap/convert_timemap/core.py ${NAME_OF_INPUT.json}
--outp ${NAME_OF_OUTPUT.xlsx}
