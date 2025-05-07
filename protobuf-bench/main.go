package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/codersgyan/protobuf-bench/userpb"
	"google.golang.org/protobuf/proto"
)

type UserJSON struct {
	ID              int      `json:"id"`
	Username        string   `json:"username"`
	Email           string   `json:"email"`
	IsActive        bool     `json:"is_active"`
	Roles           []string `json:"roles"`
	SignupTimestamp int64    `json:"signup_timestamp"`
}

func createSampleData() UserJSON {
	return UserJSON{
		ID:              12345,
		Username:        "rakesh_kohali",
		Email:           "rakesh@example.com",
		IsActive:        true,
		Roles:           []string{"admin", "editor"},
		SignupTimestamp: 1712832000,
	}
}

func createSampleProto() *userpb.User {
	return &userpb.User{
		Id:              12345,
		Username:        "rakesh_kohali",
		Email:           "rakesh@example.com",
		IsActive:        true,
		Roles:           []string{"admin", "editor"},
		SignupTimestamp: 1712832000,
	}
}

func main() {
	const iterations = 100000

	// --- JSON Benchmark ---
	user := createSampleData()

	start := time.Now()
	var jsonBytes []byte
	for i := 0; i < iterations; i++ {
		jsonBytes, _ = json.Marshal(user)
	}
	fmt.Printf("JSON serialization time: %v\n", time.Since(start))

	start = time.Now()
	for i := 0; i < iterations; i++ {
		var u UserJSON
		_ = json.Unmarshal(jsonBytes, &u)
	}
	fmt.Printf("JSON deserialization time: %v\n", time.Since(start))
	fmt.Printf("JSON size: %d bytes\n\n", len(jsonBytes))

	// --- Protobuf Benchmark ---
	protoUser := createSampleProto()

	start = time.Now()
	var protoBytes []byte
	for i := 0; i < iterations; i++ {
		protoBytes, _ = proto.Marshal(protoUser)
	}
	fmt.Printf("Protobuf serialization time: %v\n", time.Since(start))

	start = time.Now()
	for i := 0; i < iterations; i++ {
		var u userpb.User
		_ = proto.Unmarshal(protoBytes, &u)
	}
	fmt.Printf("Protobuf deserialization time: %v\n", time.Since(start))
	fmt.Printf("Protobuf size: %d bytes\n", len(protoBytes))
}
