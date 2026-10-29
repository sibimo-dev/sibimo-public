// NOTE: change this import to match the HTTP client your other services use
// (open any file in src/services and copy its import line).
import api from '@/services/api'

// Set VITE_USE_SURVEY_MOCK=true in .env to use dummy data instead of the API.
const USE_MOCK = import.meta.env.VITE_USE_SURVEY_MOCK === 'true'

// Dynamic import keeps the dummy data out of the bundle when the flag is off.
const loadMock = () => import('@/data/surveyMock')

const unwrap = (response) => response.data?.data ?? response.data

// Submit one survey response (anonymous).
export async function submitSurvey(payload) {
  if (USE_MOCK) {
    const mock = await loadMock()
    return mock.addMockResponse(payload)
  }
  const response = await api.post('/surveys', payload)
  return unwrap(response)
}

// Aggregated results only (no personal data).
export async function getPublicSurveySummary() {
  if (USE_MOCK) {
    const mock = await loadMock()
    return mock.getMockPublicSummary()
  }
  const response = await api.get('/surveys/summary')
  return unwrap(response)
}