const test = require('brittle')
const NatSampler = require('./')

test('small consistent samples', function (t) {
  const nat = new NatSampler()

  t.alike(nat.add('127.0.0.1', 9090), 1)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 9090)

  t.alike(nat.add('127.0.0.1', 9090), 2)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 9090)

  t.alike(nat.add('127.0.0.1', 9090), 3)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 9090)

  t.end()
})

test('small consistent samples with errors', function (t) {
  const nat = new NatSampler()

  t.alike(nat.add('127.0.0.1', 9090), 1)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 9090)

  t.alike(nat.add('127.0.0.1', 9091), 1)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 0)

  t.alike(nat.add('127.0.0.1', 9090), 2)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 0)

  t.alike(nat.add('127.0.0.1', 9090), 3)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 9090)

  t.alike(nat.add('127.0.0.1', 9091), 2)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 0)

  t.end()
})

test('host consistency', function (t) {
  const nat = new NatSampler()

  t.alike(nat.add('127.0.0.1', 9090), 1)
  t.alike(nat.add('127.0.0.2', 9090), 1)
  t.alike(nat.add('127.0.0.1', 9090), 2)
  t.alike(nat.add('127.0.0.2', 9090), 2)

  t.alike(nat.host, null)
  t.alike(nat.port, 0)

  t.alike(nat.add('127.0.0.1', 9090), 3)
  t.alike(nat.host, null)
  t.alike(nat.port, 0)

  t.alike(nat.add('127.0.0.1', 9090), 4)
  t.alike(nat.host, null)
  t.alike(nat.port, 0)

  t.alike(nat.add('127.0.0.1', 9090), 5)
  t.alike(nat.host, null)
  t.alike(nat.port, 0)

  t.alike(nat.add('127.0.0.1', 9091), 1)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 0)

  t.end()
})

test('can recover up to 3 errors', function (t) {
  const nat = new NatSampler()

  for (let i = 0; i < 20; i++) nat.add('127.0.0.1', 9090)

  t.alike(nat.add('127.0.0.1', 9091), 1)
  t.alike(nat.add('127.0.0.2', 9091), 1)
  t.alike(nat.add('127.0.0.3', 9091), 1)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 9090)

  for (let i = 0; i < 5; i++) nat.add('127.0.0.1', 9090)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 9090)

  nat.add('127.0.0.1', 9095)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 0)

  nat.add('127.0.0.2', 9095)
  t.alike(nat.host, '127.0.0.1')
  t.alike(nat.port, 0)

  nat.add('127.0.0.2', 9095)
  t.alike(nat.host, null)
  t.alike(nat.port, 0)

  t.end()
})
