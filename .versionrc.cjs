module.exports = {
  scripts: {
    prerelease: "node --run lint:js && node --run build && git add styles/**/*.css"
  },
  writerOpts: {
    finalizeContext(context) {
      if (!context.commitGroups?.length) {
        context.commitGroups = [{ commits: [{ header: "No significant changes" }] }];
      }
      return context;
    }
  }
};
