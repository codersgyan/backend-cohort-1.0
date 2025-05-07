## Setup

### MacOs

1. Install protoc
   `brew install protoc`

2. Install the Go plugin for protoc
   `go install google.golang.org/protobuf/cmd/protoc-gen-go@latest`

Make sure $GOPATH/bin is in your PATH (or for most users, $HOME/go/bin):
`export PATH="$PATH:$(go env GOPATH)/bin"`

3. Generate Go code
   `protoc --go_out=. user.proto`

4. Run the benchmark
   `go run main.go`
