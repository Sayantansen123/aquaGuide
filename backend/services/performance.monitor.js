import si from "systeminformation";

class ServerPerformanceMonitor {
  constructor() {
    this.history = [];
    this.maxHistory = 100;
    this.lastNet = null;

    this.thresholds = {
      cpu: 80,
      memory: 85,
      disk: 90,
    };
  }

  async collect() {
    const [cpu, mem, disks, net, procs, time] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.processes(),
      si.time(),
    ]);

    const metrics = {
      timestamp: new Date().toISOString(),
      cpu: {
        percent: Number(cpu.currentLoad.toFixed(2)),
        cores: cpu.cpus.map(c => Number(c.load.toFixed(2))),
      },
      memory: {
        total: mem.total,
        used: mem.used,
        percent: Number(((mem.used / mem.total) * 100).toFixed(2)),
      },
      disk: disks.map(d => ({
        fs: d.fs,
        used: d.used,
        total: d.size,
        percent: Number(d.use.toFixed(2)),
      })),
      network: net[0],
      processes: {
        total: procs.all,
        running: procs.running,
        topCpu: procs.list
          .sort((a, b) => b.cpu - a.cpu)
          .slice(0, 10),
      },
      uptime_seconds: time.uptime,
    };

    this.history.push(metrics);
    if (this.history.length > this.maxHistory) this.history.shift();

    return metrics;
  }

  historyLast(minutes = 60) {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return this.history.filter(
      m => new Date(m.timestamp).getTime() > cutoff
    );
  }
}

export const performanceMonitor = new ServerPerformanceMonitor();
