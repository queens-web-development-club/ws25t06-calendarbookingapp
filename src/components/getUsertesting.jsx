<Flex direction="column" justify="center" align="center" className="text-center h-full w-full">

<Text size="6">
  Add another availability, or was that all?
</Text>
<Flex gap="4" className='p-4'>
  <Button size="4" variant="soft" onClick={next}>
    Yes, that was all
  </Button>
  <Button size="4"variant="soft" onClick={prev}>
    No, I'm not done
  </Button>
</Flex>

</Flex>