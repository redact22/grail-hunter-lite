import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssistantChat } from '../AssistantChat';

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn();
});

vi.mock('../../services/geminiService', () => ({
  askAssistant: vi.fn().mockResolvedValue({ text: 'hello', links: [] }),
}));

describe('AssistantChat', () => {
  it('shows empty state message', () => {
    render(<AssistantChat />);
    expect(
      screen.getByText('Ask about vintage fashion, market trends, or authentication...')
    ).toBeInTheDocument();
  });

  it('has input field', () => {
    render(<AssistantChat />);
    const input = screen.getByPlaceholderText('Ask the intelligence network...');
    expect(input).toBeInTheDocument();
  });

  it('has send button', () => {
    render(<AssistantChat />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
