package analytics

import (
	"context"
	"fmt"

	"concall-analyser/internal/domain"
)

// AnalyticsService handles analytics business logic
type AnalyticsService interface {
	IncrementTotalVisits(ctx context.Context) error
	GetSummary(ctx context.Context) (*domain.AnalyticsSummary, error)
}

type analyticsService struct {
	repo domain.AnalyticsRepository
}

// NewAnalyticsService creates a new analytics service
func NewAnalyticsService(repo domain.AnalyticsRepository) AnalyticsService {
	return &analyticsService{
		repo: repo,
	}
}

// IncrementTotalVisits increments the total visits counter
func (s *analyticsService) IncrementTotalVisits(ctx context.Context) error {
	return s.repo.IncrementTotalVisits(ctx)
}

// GetSummary retrieves analytics summary
func (s *analyticsService) GetSummary(ctx context.Context) (*domain.AnalyticsSummary, error) {
	totalVisits, err := s.repo.GetTotalVisits(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get total visits: %w", err)
	}

	return &domain.AnalyticsSummary{
		TotalVisits: totalVisits,
	}, nil
}
