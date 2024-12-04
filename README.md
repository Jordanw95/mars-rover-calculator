## Mars Rover Calculator

A simple calculator for mars rovers positions that parses inputs like the following:

```
4 8 "(2,3,E)" "LFRFF" "(0,2,N)" "FFLFRFF"
```

and outputs the final positions of the rovers like - indicating lost rovers with `LOST`.

```
(4, 4, E)
(0, 4, W) LOST
```

The code base is split between two parts:
* "entrypoint.ts" - handles the parsing of string arguments into the validated types
* "index.ts" - contains the core logic for calculating the rover positions using validated types

# Requirements

Everything is run through docker so you will need docker installed and running on your machine.

### Running tests

You can run tests with the following commands:

```
bash test.sh
```

or to run tests in watch mode:

```
bash test.sh watch
```


### Running from commandline

You can run the program directly from the commandline with the following command:

```
./dev.sh 4 8 "(2, 3, N)" "FLLFR" "(1, 0, S)" "FFRLF"
```

Where the first two arguments are the grid size and the remaining arguments are the rover instructions