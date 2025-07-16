FROM node:22

# Install basic development tools
RUN apt update && apt install -y less man-db sudo

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Configure git
RUN git config --global user.name "shinji" && \
    git config --global user.email "clshinji@gmail.com" && \
    git config --global init.defaultBranch main

# Install Claude Code
RUN npm install -g @anthropic-ai/claude-code
