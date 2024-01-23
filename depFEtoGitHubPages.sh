rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "Setup For Github Pages"
git push origin dev