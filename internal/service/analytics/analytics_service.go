package analytics

import (
	"context"
	"fmt"
	"log"

	"concall-analyser/internal/domain"
	ws "concall-analyser/internal/websocket"
)

type AnalyticsService interface {
	IncrementTotalVisits(ctx context.Context) error
	GetSummary(ctx context.Context) (*domain.AnalyticsSummary, error)
}

type analyticsService struct {
	repo domain.AnalyticsRepository
	hub  *ws.Hub
}

func NewAnalyticsService(repo domain.AnalyticsRepository, hub *ws.Hub) AnalyticsService {
	return &analyticsService{
		repo: repo,
		hub:  hub,
	}
}

func (s *analyticsService) IncrementTotalVisits(ctx context.Context) error {
	if err := s.repo.IncrementTotalVisits(ctx); err != nil {
		return err
	}

	if s.hub != nil {
		totalVisits, err := s.repo.GetTotalVisits(ctx)
		if err == nil {
			log.Printf("Broadcasting analytics update: total_visits=%d, connected_clients=%d", totalVisits, s.hub.GetClientCount())
			s.hub.BroadcastAnalyticsUpdate(totalVisits)
		} else {
			log.Printf("Failed to get total visits for broadcast: %v", err)
		}
	}

	return nil
}

func (s *analyticsService) GetSummary(ctx context.Context) (*domain.AnalyticsSummary, error) {
	totalVisits, err := s.repo.GetTotalVisits(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get total visits: %w", err)
	}

	return &domain.AnalyticsSummary{
		TotalVisits: totalVisits,
	}, nil
}
