# Job Skills Analyzer

## Description
A web application that helps users analyze job skills requirements by fetching real-time job market data using external APIs.

## Features
- Search for job skills by job title
- Filter and sort results
- View in-demand skills for any role
- Error handling for API downtime

## APIs Used
- API Name: (add your API name here)
- API Documentation: (add link here)

## How to Run Locally
1. Clone the repository:
```
   git clone https://github.com/basnath-a11y/-job-skills-analyzer.git
```
2. Open `index.html` in your browser
3. Enter a job title to analyze required skills

## Deployment
The application is deployed on two web servers with a load balancer:
- Web01: http://52.91.114.189
- Web02: http://44.204.154.218
- Load Balancer: http://52.207.18.29

## Load Balancer Configuration
HAProxy is configured with a roundrobin algorithm to distribute traffic between Web01 and Web02.

## Credits
- API provided by (add API provider name)
- Built by IREBE Asnath