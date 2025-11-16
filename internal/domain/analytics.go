package domain

import (
	"context"
)

// AnalyticsSummary represents simplified analytics data
type AnalyticsSummary struct {
	TotalVisits int64 `json:"total_visits"`
}

// AnalyticsRepository defines the interface for analytics data persistence
type AnalyticsRepository interface {
	// IncrementTotalVisits increments the total visits counter
	IncrementTotalVisits(ctx context.Context) error

	// GetTotalVisits returns the total visits count
	GetTotalVisits(ctx context.Context) (int64, error)
}
