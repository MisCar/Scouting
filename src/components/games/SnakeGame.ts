import firebase from "../../utilities/firebase"

export enum Piece {
    Background,
    Food,
    Head,
    Body,
}

export enum Direction {
    Right = 1,
    Left = -1,
    Up = 2,
    Down = -2,
}

export const moveInDirection = (position: number[], direction: Direction) => {
    switch (direction) {
        case Direction.Up:
            return [position[0] - 1, position[1]]
        case Direction.Left:
            return [position[0], position[1] - 1]
        case Direction.Right:
            return [position[0], position[1] + 1]
        case Direction.Down:
            return [position[0] + 1, position[1]]
    }
}

const INITIAL_BOARD = [
    [
        Piece.Body,
        Piece.Body,
        Piece.Head,
        Piece.Background,
        Piece.Food,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
    ],
    [
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
    ],
    [
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
    ],
    [
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
    ],
    [
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
    ],
    [
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
    ],
    [
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
    ],
    [
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
    ],
    [
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
    ],
    [
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
        Piece.Background,
    ],
]

export const getInitialBoard = () => INITIAL_BOARD

export default class SnakeGame {
    score: number
    board: Piece[][]
    snake: number[][]
    food: number[]
    direction: Direction
    size = 10
    setBoard?: React.Dispatch<React.SetStateAction<Piece[][]>>
    setScore?: React.Dispatch<React.SetStateAction<number>>

    constructor() {
        this.score = 0
        this.snake = [
            [0, 0],
            [0, 1],
            [0, 2],
        ]
        this.food = [0, 4]
        this.direction = Direction.Right
        this.board = getInitialBoard()
    }

    getBoard() {
        let result: Piece[][] = []
        for (let i = 0; i < 10; i++) {
            let row = []
            for (let j = 0; j < 10; j++) {
                row.push(Piece.Background)
            }
            result.push(row)
        }

        for (let i = 0; i < this.snake.length - 1; i++) {
            result[this.snake[i][0]][this.snake[i][1]] = Piece.Body
        }

        const head = this.snake[this.snake.length - 1]
        result[head[0]][head[1]] = Piece.Head

        result[this.food[0]][this.food[1]] = Piece.Food

        return result
    }

    move() {
        const head = this.snake[this.snake.length - 1]

        const next = moveInDirection(head, this.direction)

        if (
            next[0] < 0 ||
            next[1] < 0 ||
            next[0] > 9 ||
            next[1] > 9 ||
            this.board[next[0]][next[1]] === Piece.Body
        ) {
            this.finish()
            return false
        }

        if (this.board[next[0]][next[1]] === Piece.Food) {
            if (this.setScore !== undefined) {
                this.score++
                this.setScore(this.score)
            }
            this.snake = [...this.snake, next]
            this.moveFoodToNewRandomLocation()
        } else this.snake = [...this.snake.slice(1), next]

        this.board = this.getBoard()
        if (this.setBoard !== undefined) {
            this.setBoard(this.board)
        }

        return true
    }

    setDirection(direction: Direction) {
        this.direction = direction
    }

    setCallbacks(
        setBoard: React.Dispatch<React.SetStateAction<Piece[][]>>,
        setScore: React.Dispatch<React.SetStateAction<number>>
    ) {
        this.setBoard = setBoard
        this.setScore = setScore
        this.setScore(0)
        const run = () => {
            if (this.move())
                setTimeout(run, Math.max(1000 - this.score * 50, 200))
        }
        run()
    }

    start() {
        this.setCallbacks(this.setBoard!, this.setScore!)
    }

    moveFoodToNewRandomLocation() {
        let position = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
        ]
        while (this.board[position[0]][position[1]] !== Piece.Background) {
            position = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ]
        }
        this.food = position
        this.board = this.getBoard()
        if (this.setBoard !== undefined) this.setBoard(this.board)
    }

    finish() {
        this.board = []
        if (this.setBoard !== undefined) this.setBoard(this.board)
        const high = window.localStorage.getItem("Snake High Score")
        if (high === null || Number(high) < this.score) {
            window.localStorage.setItem(
                "Snake High Score",
                this.score.toString()
            )
            const document = firebase
                .firestore()
                .doc("/games/" + firebase.auth().currentUser!.displayName)
            document.get().then((result) => {
                if (this.score > Number(result.data()?.snake ?? "0"))
                    document.set(
                        {
                            snake: this.score,
                        },
                        { merge: true }
                    )
            })
        }
        return false
    }
}
