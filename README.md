# Flask Maze Game

This project is a **Flask-based Maze Game** where users can navigate through randomly generated mazes. The game starts with smaller mazes and progressively increases in size after each level. The player's name and high scores are saved in a database. This app is designed to be hosted on a virtual machine, such as on **Google Cloud Platform (GCP)**.

## Features
- Randomly generated mazes that increase in size per level.
- Cheat mode that allows the player to pass through walls (`ashu123`).
- Speed mode that increases movement speed (`mohitspeed`).
- High score system stored in an SQL database.
- Accessible via web browser with Flask's built-in server.
- Background running of the app using `nohup` or `screen`.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Cheat Codes](#cheat-codes)
- [Running on Google Cloud Platform (GCP)](#running-on-google-cloud-platform-gcp)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites
- **Python 3.9**
- **pip** (Python package manager)
- **Google Cloud Platform (GCP) VM** (or any Linux server)
- **Flask** and other Python dependencies (see `requirements.txt`)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Set up a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set the `FLASK_APP` environment variable:
   ```bash
   export FLASK_APP=app.py
   ```

5. Run the app:
   ```bash
   flask run --host=0.0.0.0 --port=5000
   ```

## Usage

After starting the Flask server, open your web browser and navigate to:
```
http://<your-external-ip>:5000
```

You will be prompted to enter your name and begin navigating the maze. The maze grows progressively larger as you complete levels. Your score and the time taken are saved in the high scores list.

### To Keep Flask Running After Disconnecting:
If you're hosting this on a server (like a GCP VM), you can use `nohup` to run the Flask app in the background:
```bash
nohup flask run --host=0.0.0.0 --port=5000 &
```

### Logs
You can view the logs by running:
```bash
tail -f nohup.out
```

## Cheat Codes

You can activate the following cheat codes by typing the sequences in the browser:

1. **Cheat Mode** (`ashu123`): Allows you to pass through walls.
2. **Speed Mode** (`mohitspeed`): Increases your movement speed.

## Running on Google Cloud Platform (GCP)

1. **Create a VM Instance** on GCP.
2. **SSH into the VM** and install the necessary software (Python, Flask, etc.).
3. Follow the installation steps above to deploy the Flask app.
4. Update GCP firewall rules to allow traffic on port `5000`.

### GCP Firewall Rule
Ensure port `5000` is open on your VM:
1. Go to **VPC Network** -> **Firewall Rules**.
2. Create a rule allowing inbound traffic on port `5000`.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

### Optional Additions:
- **Demo Link**: [Click Here!](http://34.93.246.220:5000/)
